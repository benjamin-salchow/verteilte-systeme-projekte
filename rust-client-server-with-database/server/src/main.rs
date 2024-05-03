use actix_files::Files;

use actix_web::{
    delete, get, http::header, middleware, post, web, App, HttpRequest, HttpResponse, HttpServer,
    Responder, Result,
};
use mime;
use mysql::{params, prelude::*, Pool};
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use std::{env, fmt};

// for testing
#[cfg(test)]
mod test;

// Connection builder for MySQL driver
fn get_conn_builder(
    db_user: String,
    db_password: String,
    db_host: String,
    db_port: u16,
    db_name: String,
) -> mysql::OptsBuilder {
    mysql::OptsBuilder::new()
        .ip_or_hostname(Some(db_host))
        .tcp_port(db_port)
        .db_name(Some(db_name))
        .user(Some(db_user))
        .pass(Some(db_password))
}

// Struct for the client_post
#[derive(Serialize, Deserialize, Debug)]
struct PostInfo {
    post_content: Option<String>,
}

// Struct for Response
#[derive(Debug, Serialize, Deserialize)]
struct ResponseMessage {
    message: String,
}

// Struct for button 1 HTML form sample
#[derive(Debug, Serialize, Deserialize)]
struct NameInfo {
    name: String,
}

// Struct for DB Entry
#[derive(Serialize, Deserialize)]
struct Entry {
    task_id: i32,
    title: String,
    description: String,
    created_at: String,
}

// Struct for information to create entry
#[derive(Serialize, Deserialize)]
struct EntryCreate {
    title: String,
    description: String,
}

// Define a struct to represent the success response
#[derive(Serialize)]
struct SuccessResponse {
    message: String,
}

// Define a struct to represent the error response
#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

// Implement Display trait for Error Response
impl fmt::Display for ErrorResponse {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.error)
    }
}

// Define a custom error type that can wrap both serde_json::Error and mysql::Error
#[derive(Debug)]
enum CustomError {
    SerializationError(serde_json::Error),
    DatabaseError(mysql::Error),
}

impl fmt::Display for CustomError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CustomError::SerializationError(e) => write!(f, "Serialization Error: {}", e),
            CustomError::DatabaseError(e) => write!(f, "Database Error: {}", e),
        }
    }
}

impl std::error::Error for CustomError {}

impl From<serde_json::Error> for CustomError {
    fn from(error: serde_json::Error) -> Self {
        CustomError::SerializationError(error)
    }
}

impl From<mysql::Error> for CustomError {
    fn from(error: mysql::Error) -> Self {
        CustomError::DatabaseError(error)
    }
}

// GET Path - call it with: http://localhost:8080/special_path
#[get("/special_path")]
async fn special_path() -> impl Responder {
    HttpResponse::Ok().body("This is another path")
}

// Another GET Path that shows the actual Request (req) Headers - call it with: http://localhost:8080/request_info
#[get("/request_info")]
async fn request_info(req: HttpRequest) -> impl Responder {
    log::info!("Request content: {:?}", req);
    HttpResponse::Ok().body(format!("This is all I got from the request: {:?}", req))
}

// POST Path - call it with: POST http://localhost:8080/client_post
#[post("/client_post")]
async fn client_post(info: web::Json<PostInfo>) -> impl Responder {
    if let Some(post_content) = &info.post_content {
        log::info!("Client sent 'post_content' with content: {}", post_content);
        HttpResponse::Ok().json(ResponseMessage {
            message: format!("I got your message: {}", post_content),
        })
    } else {
        log::error!("Client sent no 'post_content'");
        HttpResponse::BadRequest().json(ResponseMessage {
            message: "This function requires a body with 'post_content'".to_string(),
        })
    }
}

// ###################### BUTTON EXAMPLE ######################
// POST path for Button 1
#[post("/button1_name")]
async fn button1(params: web::Form<NameInfo>) -> impl Responder {
    // Load the name from the form data
    let name = &params.name;

    // Print it out in console
    log::info!("Client send the following name: {} | Button1", name);

    // Send HTML response back
    HttpResponse::Ok()
        .insert_header(header::ContentType(mime::TEXT_PLAIN))
        .body(format!("I got your message - Name is: {}", name))
}

// GET path for Button 2
#[get("/button2")]
async fn button2() -> impl Responder {
    // Generate a random number
    let random_number = rand::thread_rng().gen::<f64>();
    // Print it out
    log::info!(
        "Send the following random number to the client: {} | Button2",
        random_number
    );
    // Respond with the random number
    HttpResponse::Ok().body(format!("Antwort: {}", random_number))
    // Instead of plain TXT - the answer could be a JSON
    // More information here: https://www.w3schools.com/xml/ajax_intro.asp
}
// ###################### BUTTON EXAMPLE END ######################

// ###################### DATABASE PART ######################

// Handler for fetching all entries from table1
#[get("/database")]
async fn get_entries(pool: web::Data<Pool>) -> impl Responder {
    log::info!("Request to load all entries from table1");
    // run sub function to fetch all entries and return
    match fetch_entries(pool).await {
        Ok(results) => HttpResponse::Ok().json(results),
        Err(e) => {
            log::error!("Error: {}", e);
            HttpResponse::InternalServerError().json(e.to_string())
        }
    }
}

// Function to fetch all entries from table1
async fn fetch_entries(pool: web::Data<Pool>) -> Result<Vec<Entry>, mysql::Error> {
    // use the connection pool with try (on failure it will return mysql::Error)
    let mut conn = pool.get_conn()?;
    // prepares the Vec<Entry> of all the results and returns it.
    let results = conn.query_map(
        "SELECT * FROM table1",
        |(task_id, title, description, created_at)| Entry {
            task_id,
            title,
            description,
            created_at,
        },
    )?;
    Ok(results)
}

// Handler for deleting an entry by ID
#[delete("/database/{id}")]
async fn delete_entry(pool: web::Data<Pool>, path: web::Path<i32>) -> impl Responder {
    // convert path into int
    let id = path.into_inner();
    log::info!("Request to delete Item: {}", id);

    // run the sub function to delete the entry
    match delete_entry_by_id(pool, id).await {
        Ok(response) => response,
        Err(e) => {
            log::error!("Error: {}", e);
            HttpResponse::InternalServerError().json(e.to_string())
        }
    }
}

// Function to delete an entry by ID
async fn delete_entry_by_id(
    pool: web::Data<Pool>,
    id: i32,
) -> Result<HttpResponse, CustomError> {
    let mut conn = pool.get_conn()?;
    match conn.exec_drop(
        "DELETE FROM table1 WHERE task_id = :id",
        params! {"id" => id},
    ) {
        Ok(_) => {
            // If insertion was successful, create a success response struct
            let success_response = SuccessResponse {
                message: format!("Entry with id {id} deleted successfully"),
            };
            // Serialize the success response struct to JSON
            let json_response = serde_json::to_string(&success_response)?;
            // Return an HTTP response with JSON body
            Ok(HttpResponse::Ok().json(json_response))
        }
        Err(err) => {
            // If there was an error, create an error response struct
            let error_response = ErrorResponse {
                error: err.to_string(),
            };
            // Serialize the error response struct to JSON
            let json_response = serde_json::to_string(&error_response)?;
            // Return an HTTP response with JSON body and status code 500 (Internal Server Error)
            Ok(HttpResponse::InternalServerError().json(json_response))
        }
    }
}

// Handler for adding a new row
#[post("/database")]
async fn add_entry(
    pool: web::Data<Pool>,
    req_body: web::Json<EntryCreate>,
) -> impl Responder {
    let new_entry: EntryCreate = req_body.into_inner();
    log::info!(
        "Client send database insert request with 'title': {} ; description: {}",
        new_entry.title,
        new_entry.description
    );
    // run sub function for db handling
    match add_new_entry(pool, new_entry).await {
        Ok(response) => response,
        Err(e) => {
            log::error!("Error: {}", e);
            HttpResponse::InternalServerError().json(e.to_string())
        }
    }
}

// Function to add a new entry
async fn add_new_entry(
    pool: web::Data<Pool>,
    entry: EntryCreate,
) -> Result<HttpResponse, CustomError> {
    let mut conn = pool.get_conn()?;
    match conn.exec_drop(
        "INSERT INTO table1 (title, description, created_at) VALUES (:title, :description, CURRENT_TIMESTAMP)",
        params! {"title" => entry.title, "description" => entry.description}
    )
    {
        Ok(_) => {
            // If insertion was successful, create a success response struct
            let success_response = SuccessResponse {
                message: "Entry added successfully".to_string(),
            };
            // Serialize the success response struct to JSON
            let json_response = serde_json::to_string(&success_response)?;
            // Return an HTTP response with JSON body
            Ok(HttpResponse::Ok().json(json_response))
        },
        Err(err) => {
            // If there was an error, create an error response struct
            let error_response = ErrorResponse {
                error: err.to_string(),
            };
            // Serialize the error response struct to JSON
            let json_response = serde_json::to_string(&error_response)?;
            // Return an HTTP response with JSON body and status code 500 (Internal Server Error)
            Ok(HttpResponse::InternalServerError().json(json_response))
        }
    }
}

// ###################### DATABASE PART END ######################

// Add some basic retry logic to try to connect to the DB
// MySQL needs sometimes more time to boot.
fn connect_db_with_retry(builder: mysql::OptsBuilder) -> Pool {
    let max_retries = 30;
    let wait_time = Duration::from_secs(5);
    let mut retries = 0;
    log::info!("Trying to connect to DB...");

    loop {
        match Pool::new(builder.clone()) {
            Ok(pool) => {
                // put it into a shared_data object, later used by actix web
                return pool;
            }
            Err(e) => {
                retries += 1;
                if retries >= max_retries {
                    log::error!("Max retries reached for connecting to DB!");
                    panic!("Couldn't connect to DB")
                }
                log::error!("DB not ready! - {} - retry in 20 seconds - {} of {}", e.to_string(), retries, max_retries);
                std::thread::sleep(wait_time);
                continue;
            }
        };
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // initialize environment
    dotenvy::dotenv().ok();

    // initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Set up port for the server - if no port is specified 8080 will be used
    let port = env::var_os("PORT")
        .map(|val| {
            val.into_string()
                .expect("PORT is not a valid Unicode string")
                .parse::<u16>()
                .expect("PORT is not a valid port number")
        })
        .unwrap_or_else(|| {
            log::warn!("Warning: PORT environment variable not set, using default port 8080");
            8080
        });

    log::info!("setting up app from environment");

    let db_user = env::var("MYSQL_USER").expect("MYSQL_USER is not set in .env file");
    let db_password = env::var("MYSQL_PASSWORD").expect("MYSQL_PASSWORD is not set in .env file");
    let db_host = env::var("MYSQL_HOSTNAME").expect("MYSQL_HOSTNAME is not set in .env file");
    let db_port = env::var("MYSQL_PORT").expect("MYSQL_PORT is not set in .env file");
    let db_name = env::var("MYSQL_DATABASE").expect("MYSQL_DATABASE is not set in .env file");
    let db_port = db_port.parse().unwrap();

    log::info!("initializing database connection");

    // build connection with use of the given parameter
    let builder = get_conn_builder(db_user, db_password, db_host, db_port, db_name);

    // create the DB connection pool
    let shared_data = web::Data::new(connect_db_with_retry(builder));

    log::info!("Starting HTTP server: go to http://localhost:8080");

    HttpServer::new(move || {
        App::new()
            // enable automatic response compression
            .wrap(middleware::Compress::default())
            // enable logger
            .wrap(middleware::Logger::default())
            // db pool will be used as app_data for requests
            .app_data(shared_data.clone())
            // all the following are the services (API endpoints used by this example)
            .service(special_path)
            .service(request_info)
            .service(button1)
            .service(button2)
            .service(add_entry)
            .service(delete_entry)
            .service(get_entries)
            // If nothing before matches, move the request to static file
            .service(Files::new("/static/", "./public/").index_file("index.html"))
            // redirect to landing page
            .service(
                web::resource("/").route(web::get().to(|req: HttpRequest| async move {
                    log::info!("{req:?}");
                    HttpResponse::Found()
                        .insert_header((header::LOCATION, "static/index.html"))
                        .finish()
                })),
            )
    })
    // bind to 0.0.0.0 to accept all incoming traffic (listening on all interfaces)
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
