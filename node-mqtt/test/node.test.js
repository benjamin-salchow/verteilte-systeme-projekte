'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'node.js'), 'utf8');

test('configures mqtt client and topic', () => {
  assert.match(source, /mqtt\.connect\(/);
  assert.match(source, /client\.subscribe\('mytopic'/);
  assert.match(source, /client\.publish\('mytopic'/);
});

test('publishes periodic random messages from the configured node', () => {
  assert.match(source, /process\.env\.NODENAME/);
  assert.match(source, /setInterval/);
  assert.match(source, /Math\.random\(\)/);
  assert.match(source, /Received:/);
});
