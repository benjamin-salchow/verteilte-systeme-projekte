'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');

test('defines db routes and limiter', () => {
  assert.match(source, /express-rate-limit/);
  assert.match(source, /app\.get\('\/database'/);
  assert.match(source, /app\.post\('\/database'/);
  assert.match(source, /app\.delete\('\/database\/:id'/);
});
