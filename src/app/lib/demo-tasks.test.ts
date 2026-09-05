import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemoTaskStore, DEMO_STORAGE_KEY } from './demo-tasks.ts';

function fixture(initial?: string) {
  const values = new Map<string, string>(initial === undefined ? [] : [[DEMO_STORAGE_KEY, initial]]);
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
  return { values, storage, store: createDemoTaskStore(() => storage) };
}

test('seeds once and persists create, complete, reopen and delete across store instances', async () => {
  const { store, storage } = fixture();
  assert.equal((await store.getTasks()).length, 3);
  const task = await store.createTask('  Write release notes  ');
  assert.equal(task.text, 'Write release notes');
  await store.setTaskCompleted(task.id, true);
  const reloaded = createDemoTaskStore(() => storage);
  assert.equal((await reloaded.getTasks()).find((item) => item.id === task.id)?.completed, true);
  await reloaded.setTaskCompleted(task.id, false);
  assert.equal((await store.getTasks()).find((item) => item.id === task.id)?.completed, false);
  for (const item of await store.getTasks()) await store.removeTask(item.id);
  assert.deepEqual(await reloaded.getTasks(), []);
});

test('rejects invalid input without changing storage', async () => {
  const { store, values } = fixture('[]');
  for (const value of [' ', 'x'.repeat(161)]) await assert.rejects(store.createTask(value));
  await assert.rejects(store.setTaskCompleted('missing', true), /not found/);
  assert.equal(values.get(DEMO_STORAGE_KEY), '[]');
});

test('preserves malformed saved data and reports a recovery instruction', async () => {
  for (const raw of ['{', 'null', '{}', '[{"id":"x"}]', JSON.stringify([
    { id: 'x', text: 'one', completed: false }, { id: 'x', text: 'two', completed: false },
  ])]) {
    const { store, values } = fixture(raw);
    await assert.rejects(store.getTasks(), /has not been overwritten/);
    assert.equal(values.get(DEMO_STORAGE_KEY), raw);
  }
});

test('reports blocked storage and quota failures without pretending to save', async () => {
  const blocked = createDemoTaskStore(() => { throw new Error('Blocked'); });
  await assert.rejects(blocked.getTasks(), /storage is unavailable/);
  const full = createDemoTaskStore(() => ({ getItem: () => '[]', setItem: () => { throw new Error('Quota'); } }));
  await assert.rejects(full.createTask('Read'), /could not save/);
});

test('aborted loads do not seed storage', async () => {
  const { store, values } = fixture();
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(store.getTasks(controller.signal), { name: 'AbortError' });
  assert.equal(values.size, 0);
});
