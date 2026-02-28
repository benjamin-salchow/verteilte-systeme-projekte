'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');

test('defines core routes', () => {
  assert.match(source, /app\.get\('\/'/);
  assert.match(source, /app\.get\('\/special_path'/);
  assert.match(source, /app\.post\('\/client_post'/);
});
