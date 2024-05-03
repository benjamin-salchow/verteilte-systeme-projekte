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
    use crate::NameInfo;

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
}
