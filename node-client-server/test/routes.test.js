'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createApp } = require('../server');

let server;
let baseUrl;

test.before(async () => {
  server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => {
  server.close();
});

test('GET / returns hello world', async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'Hello World');
});

test('GET /special_path returns the secondary route', async () => {
  const response = await fetch(`${baseUrl}/special_path`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'This is another path');
});

test('GET /request_info reflects headers in response body', async () => {
  const response = await fetch(`${baseUrl}/request_info`, {
    headers: { 'X-Test': 'ok' },
  });

  assert.equal(response.status, 200);
  assert.match(await response.text(), /x-test/i);
});

test('POST /client_post returns success for valid JSON', async () => {
  const response = await fetch(`${baseUrl}/client_post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_content: 'hello' }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { message: 'I got your message: hello' });
});

test('POST /client_post rejects missing payload', async () => {
  const response = await fetch(`${baseUrl}/client_post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    message: 'This function requries a body with "post_content"',
  });
});
