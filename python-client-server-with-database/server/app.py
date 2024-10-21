import os
import time
import random
from flask import Flask, request, jsonify, redirect, send_from_directory
import mariadb
import logging

# Flask app
app = Flask(__name__, static_folder='public')

# Logger setup
logging.basicConfig(level=logging.INFO)

# Database connection info
db_config = {
    'host': os.getenv('MYSQL_HOSTNAME'),
    'user': os.getenv('MYSQL_USER'),
    'password': os.getenv('MYSQL_PASSWORD'),
    'database': os.getenv('MYSQL_DATABASE'),
    'port': 3306
}

# Retry settings for database connection
MAX_RETRIES = 10
RETRY_DELAY = 5  # seconds

# Initialize database connection pool
def init_db_connection():
    retries = 0
    while retries < MAX_RETRIES:
        try:
            conn = mariadb.connect(**db_config)
            logging.info("Connected to the MariaDB database successfully.")
            return conn
        except mariadb.Error as e:
            logging.error(f"Failed to connect to database: {e}")
            retries += 1
            logging.info(f"Retrying to connect to database in {RETRY_DELAY} seconds... ({retries}/{MAX_RETRIES})")
            time.sleep(RETRY_DELAY)

    logging.error("Max retries exceeded. Could not connect to database.")
    exit(1)

# Replace db_connection with a function to ensure a fresh connection
def get_db_connection():
    return init_db_connection()

# Check the connection
def check_db_connection():
    try:
        conn = get_db_connection()  # Get a new connection
        cursor = conn.cursor()
        cursor.execute('SELECT 1 + 1 AS solution')
        result = cursor.fetchone()
        if result[0] == 2:
            logging.info("Database connected and works")
        else:
            logging.error("Something is wrong with your database connection!")
            exit(5)
    except Exception as e:
        logging.error(f"Database connection failed: {e}")
        exit(5)
    finally:
        cursor.close()
        conn.close()  # Ensure the connection is closed

# Check connection at start
check_db_connection()

# ###################### ROUTES ######################

# Entrypoint - call it with: http://localhost:8080/ -> redirect to /static
@app.route('/')
def index():
    logging.info("Got a request and redirecting to the static page")
    return redirect('/static/index.html')

# Another GET path - call it with: http://localhost:8080/special_path
@app.route('/special_path')
def special_path():
    return "This is another path"

# Another GET path that shows the actual Request (req) Headers - call it with: http://localhost:8080/request_info
@app.route('/request_info')
def request_info():
    logging.info(f"Request content: {request.headers}")
    return f"This is all I got from the request: {dict(request.headers)}"

# POST path - call it with: POST http://localhost:8080/client_post
@app.route('/client_post', methods=['POST'])
def client_post():
    post_content = request.json.get('post_content', None)
    if post_content:
        logging.info(f"Client sent 'post_content' with content: {post_content}")
        return jsonify({'message': f'I got your message: {post_content}'}), 200
    else:
        logging.error("Client sent no 'post_content'")
        return jsonify({'message': 'This function requires a body with "post_content"'}), 400

# ###################### BUTTON EXAMPLES ######################

# POST path for Button 1
@app.route('/button1_name/', methods=['POST'])
def button1_name():
    # Check if data is JSON, otherwise fallback to form data
    if request.is_json:
        name = request.json.get('name', None)
    else:
        name = request.form.get('name', None)  # Get name from form data

    logging.info(f"Client sent the following name: {name} | Button1")
    return jsonify({'message': f'I got your message - Name is: {name}'}), 200

# GET path for Button 2
@app.route('/button2')
def button2():
    random_number = round(random.random(), 5)
    logging.info(f"Send the following random number to the client: {random_number} | Button2")
    return f"Antwort: {random_number}"

# ###################### DATABASE PART ######################

# GET path for database - retrieve all entries
@app.route('/database')
def get_database_entries():
    logging.info("Request to load all entries from table1")
    try:
        conn = get_db_connection()  # Get a new connection
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM table1")
        results = cursor.fetchall()
        logging.info(f"Success answer from DB: {results}")
        return jsonify(results), 200
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()  # Ensure the connection is closed

# DELETE path for database - delete an entry by ID
@app.route('/database/<int:id>', methods=['DELETE'])
def delete_database_entry(id):
    logging.info(f"Request to delete Item: {id}")
    try:
        conn = get_db_connection()  # Get a new connection
        cursor = conn.cursor()
        cursor.execute("DELETE FROM table1 WHERE task_id = %s", (id,))
        conn.commit()
        logging.info(f"Deleted Item: {id}")
        return jsonify({'message': 'Deleted'}), 200
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()  # Ensure the connection is closed

# POST path for database - insert new entry
@app.route('/database', methods=['POST'])
def add_database_entry():
    title = request.json.get('title')
    description = request.json.get('description')

    if title and description:
        logging.info(f"Client sent database insert request with 'title': {title}; description: {description}")
        try:
            conn = get_db_connection()  # Get a new connection
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO table1 (title, description, created_at)
                VALUES (%s, %s, CURRENT_TIMESTAMP)
            """, (title, description))
            conn.commit()
            logging.info(f"Insert Success")
            return jsonify({'message': 'Inserted'}), 200
        except Exception as e:
            logging.error(f"Error: {e}")
            return jsonify({'error': str(e)}), 500
        finally:
            cursor.close()
            conn.close()  # Ensure the connection is closed
    else:
        logging.error("Client sent no correct data!")
        return jsonify({'message': 'This function requires a body with "title" and "description"'}), 400

# ###################### STATIC FILES ######################

# All requests to /static/... will be redirected to static files in the folder "public"
@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

# Start the actual server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 8080)))
