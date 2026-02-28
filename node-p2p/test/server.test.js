'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf8');

test('configures peerjs server', () => {
  assert.match(source, /ExpressPeerServer/);
  assert.match(source, /app\.use\('\/peerjs'/);
  assert.match(source, /app\.use\('\/static'/);
});
