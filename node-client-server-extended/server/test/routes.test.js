'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');

test('defines extended routes', () => {
  assert.match(source, /app\.get\('\/'/);
  assert.match(source, /app\.post\('\/button1_name'/);
  assert.match(source, /app\.get\('\/button2'/);
  assert.match(source, /app\.use\('\/static'/);
});
