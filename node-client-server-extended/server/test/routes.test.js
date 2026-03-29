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

test('GET / redirects to static frontend', async () => {
  const response = await fetch(`${baseUrl}/`, { redirect: 'manual' });

  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), '/static');
});

test('POST /button1_name accepts form submissions', async () => {
  const body = new URLSearchParams({ name: 'Alice' });
  const response = await fetch(`${baseUrl}/button1_name`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    message: 'I got your message - Name is: Alice',
  });
});

test('GET /button2 returns a random number response', async () => {
  const response = await fetch(`${baseUrl}/button2`);

  assert.equal(response.status, 200);
  assert.match(await response.text(), /^Antwort: 0\.\d+$/);
});

test('POST /client_post rejects missing post_content', async () => {
  const response = await fetch(`${baseUrl}/client_post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
});

test('GET /request_info includes custom headers', async () => {
  const response = await fetch(`${baseUrl}/request_info`, {
    headers: { 'X-Test': 'extended' },
  });

  assert.equal(response.status, 200);
  assert.match(await response.text(), /extended/);
});
