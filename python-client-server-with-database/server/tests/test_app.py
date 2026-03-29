import os
import sys
import types
import unittest
from unittest import mock

os.environ['SKIP_DB_CHECK'] = '1'
sys.modules.setdefault('mariadb', types.SimpleNamespace(connect=mock.Mock(), Error=Exception))

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

    def test_request_info_returns_headers_as_json(self):
        response = self.client.get('/request_info', headers={'X-Test': 'python'})
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertEqual(payload['message'], 'This is all I got from the request')
        self.assertEqual(payload['headers']['X-Test'], 'python')

    def test_button1_name_accepts_json(self):
        response = self.client.post('/button1_name/', json={'name': 'Alice'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['message'], 'I got your message - Name is: Alice')

    def test_button1_name_accepts_form_data(self):
        response = self.client.post('/button1_name/', data={'name': 'Bob'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['message'], 'I got your message - Name is: Bob')

    def test_button2_returns_random_prefix(self):
        response = self.client.get('/button2')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_data(as_text=True).startswith('Antwort: '))

    def test_database_insert_validation_happens_before_db_access(self):
        with mock.patch.object(app_module, 'get_db_connection') as mocked_db:
            response = self.client.post('/database', json={'title': 'only title'})

        self.assertEqual(response.status_code, 400)
        self.assertIn('requires a body', response.get_json()['message'])
        mocked_db.assert_not_called()


if __name__ == '__main__':
    unittest.main()
