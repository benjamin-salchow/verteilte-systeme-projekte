'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const serverSource = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
const clientSource = fs.readFileSync(path.join(__dirname, '..', 'client.js'), 'utf8');

test('server binds tcp port and replies', () => {
  assert.match(serverSource, /server\.listen\(9233/);
  assert.match(serverSource, /socket\.write\("Hello back"\)/);
});

test('client connects and writes payload', () => {
  assert.match(clientSource, /client\.connect\(9233/);
  assert.match(clientSource, /client\.write\('Hello, super server! Love, Client\.'/);
});
