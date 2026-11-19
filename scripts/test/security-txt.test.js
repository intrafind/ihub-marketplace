// Tests of site/.well-known/security.txt, which the marketplace website publishes.
//
// RFC 9116 requires an Expires date less than a year ahead; a stale file tells
// researchers the contact is dead. This test starts failing 30 days before the
// date, so it is renewed in time: move Expires forward by up to a year.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, '..', '..', 'site', '.well-known', 'security.txt');
const fields = Object.fromEntries(
  fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(line => line.includes(':'))
    .map(line => [line.slice(0, line.indexOf(':')).trim(), line.slice(line.indexOf(':') + 1).trim()])
);
const DAY = 24 * 60 * 60 * 1000;

test('security.txt names a contact and a policy', () => {
  assert.match(fields.Contact, /^mailto:\S+@\S+$/);
  assert.match(fields.Policy, /^https:\/\//);
});

test('security.txt expires more than 30 days and less than a year from now', () => {
  const expires = Date.parse(fields.Expires);
  assert.ok(!Number.isNaN(expires), 'Expires is a date');
  assert.ok(expires - Date.now() > 30 * DAY, 'renew Expires: it is less than 30 days away');
  assert.ok(expires - Date.now() <= 366 * DAY, 'Expires must be less than a year ahead');
});
