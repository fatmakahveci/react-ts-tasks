import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { Readable } from 'node:stream';
import test from 'node:test';

// Resolve exactly the dependencies used by the pinned Firebase CLI.
const require = createRequire(import.meta.resolve('firebase-tools/package.json'));
const Chain = require('stream-chain');
const { parserStream } = require('stream-json');
const { filter } = require('stream-json/filters/filter.js');
const { pick } = require('stream-json/filters/pick.js');
const { streamObject } = require('stream-json/streamers/stream-object.js');
const { streamArray } = require('stream-json/streamers/stream-array.js');

async function collect(json, ...stages) {
  const pipeline = new Chain([Readable.from([json]), ...stages]);
  const values = [];
  for await (const value of pipeline) values.push(value);
  return values;
}

test('Firebase database import filters nested objects', async () => {
  const actual = await collect('{"tasks":{"one":{"title":"Read"}},"ignored":true}',
    filter.withParserAsStream({ filter: 'tasks', pathSeparator: '/' }), streamObject.asStream());
  assert.deepEqual(actual, [{ key: 'tasks', value: { one: { title: 'Read' } } }]);
});

test('Firebase auth import streams only the users array', async () => {
  const actual = await collect('{"users":[{"localId":"one"},{"localId":"two"}],"ignored":[]}',
    pick.withParserAsStream({ filter: /^users$/ }), streamArray.asStream());
  assert.deepEqual(actual.map(({ value }) => value.localId), ['one', 'two']);
});

test('Firebase Next integration reads npm dependency output', async () => {
  const actual = await collect('{"name":"app","dependencies":{"next":{"version":"16.3.4","dependencies":{"react":{"version":"19.2.8"}}}}}',
    parserStream({ packValues: false, packKeys: true, streamValues: false }),
    pick.asStream({ filter: 'dependencies' }), streamObject.asStream());
  // The CLI intentionally discards scalar values; it only walks dependency names.
  assert.deepEqual(actual, [{ key: 'next', value: { dependencies: { react: {} } } }]);
});

test('Firebase import rejects malformed JSON', async () => {
  await assert.rejects(collect('{"users":[',
    pick.withParserAsStream({ filter: /^users$/ }), streamArray.asStream()));
});

test('patched Firebase CLI modules load with the secure parser', () => {
  require('firebase-tools/lib/database/import.js');
  require('firebase-tools/lib/commands/auth-import.js');
  require('firebase-tools/lib/frameworks/next/index.js');
});
