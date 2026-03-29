#[cfg(test)]
mod tests {
    use actix_web::{
        body::to_bytes,
        dev::ServiceResponse,
        http::{
            header::{HeaderValue, CONTENT_TYPE},
            StatusCode,
        },
        test::{self},
        web::Bytes,
        App,
    };

    use crate::button1;
    use crate::button2;
    use crate::client_post;
    use crate::request_info;
    use crate::NameInfo;
    use crate::PostInfo;
    use crate::special_path;

    trait BodyTest {
        fn as_str(&self) -> &str;
    }

    impl BodyTest for Bytes {
        fn as_str(&self) -> &str {
            std::str::from_utf8(self).unwrap()
        }
    }

    #[actix_web::test]
    async fn handle_button_1_integration_test() {
        let app = test::init_service(App::new().service(button1)).await;
        let req = test::TestRequest::post()
            .uri("/button1_name")
            .set_form(NameInfo {
                name: "John".to_string(),
            })
            .to_request();
        let resp: ServiceResponse = test::call_service(&app, req).await;

        assert_eq!(resp.status(), StatusCode::OK);
        assert_eq!(
            resp.headers().get(CONTENT_TYPE).unwrap(),
            HeaderValue::from_static("text/plain")
        );
        let body = to_bytes(resp.into_body()).await.unwrap();
        assert_eq!(body.as_str(), "I got your message - Name is: John");
    }

    #[actix_web::test]
    async fn handle_special_path_test() {
        let app = test::init_service(App::new().service(special_path)).await;
        let req = test::TestRequest::get().uri("/special_path").to_request();
        let resp: ServiceResponse = test::call_service(&app, req).await;

        assert_eq!(resp.status(), StatusCode::OK);
        let body = to_bytes(resp.into_body()).await.unwrap();
        assert_eq!(body.as_str(), "This is another path");
    }

    #[actix_web::test]
    async fn handle_client_post_validation_test() {
        let app = test::init_service(App::new().service(client_post)).await;

        let req_ok = test::TestRequest::post()
            .uri("/client_post")
            .set_json(PostInfo {
                post_content: Some("hello".to_string()),
            })
            .to_request();
        let resp_ok: ServiceResponse = test::call_service(&app, req_ok).await;
        assert_eq!(resp_ok.status(), StatusCode::OK);

        let req_bad = test::TestRequest::post()
            .uri("/client_post")
            .set_json(PostInfo { post_content: None })
            .to_request();
        let resp_bad: ServiceResponse = test::call_service(&app, req_bad).await;
        assert_eq!(resp_bad.status(), StatusCode::BAD_REQUEST);
    }

    #[actix_web::test]
    async fn handle_request_info_returns_headers() {
        let app = test::init_service(App::new().service(request_info)).await;
        let req = test::TestRequest::get()
            .uri("/request_info")
            .insert_header(("X-Test", "rust"))
            .to_request();
        let resp: ServiceResponse = test::call_service(&app, req).await;

        assert_eq!(resp.status(), StatusCode::OK);
        let body = to_bytes(resp.into_body()).await.unwrap();
        let response_body = body.as_str().to_lowercase();
        assert!(response_body.contains("x-test"));
        assert!(response_body.contains("rust"));
    }

    #[actix_web::test]
    async fn handle_button_2_returns_random_response() {
        let app = test::init_service(App::new().service(button2)).await;
        let req = test::TestRequest::get().uri("/button2").to_request();
        let resp: ServiceResponse = test::call_service(&app, req).await;

        assert_eq!(resp.status(), StatusCode::OK);
        let body = to_bytes(resp.into_body()).await.unwrap();
        assert!(body.as_str().starts_with("Antwort: "));
    }
}
