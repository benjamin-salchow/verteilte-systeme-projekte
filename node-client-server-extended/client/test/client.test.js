'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'client.js'), 'utf8');

test('client posts to server endpoint', () => {
  assert.match(source, /axios\.post\(/);
  assert.match(source, /\/client_post/);
  assert.match(source, /setInterval/);
});
