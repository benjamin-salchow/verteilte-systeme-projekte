import os
import unittest

os.environ['SKIP_DB_CHECK'] = '1'

import app as app_module


class FlaskRoutesTest(unittest.TestCase):
    def setUp(self):
        app_module.app.config['TESTING'] = True
        self.client = app_module.app.test_client()

    def test_root_redirects_to_static_index(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 302)
        self.assertIn('/static/index.html', response.headers.get('Location', ''))

    def test_special_path(self):
        response = self.client.get('/special_path')
        self.assertEqual(response.status_code, 200)
        self.assertIn('This is another path', response.get_data(as_text=True))

    def test_client_post_success(self):
        response = self.client.post('/client_post', json={'post_content': 'hello'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['message'], 'I got your message: hello')

    def test_client_post_missing_body(self):
        response = self.client.post('/client_post', json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn('requires a body', response.get_json()['message'])


if __name__ == '__main__':
    unittest.main()
