import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { deleteApp } from 'firebase/app';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

test('database rules isolate accounts and validate task mutations', async () => {
  const env = await initializeTestEnvironment({
    projectId: 'demo-focus',
    database: { host: '127.0.0.1', port: 9000, rules: await readFile('database.rules.json', 'utf8') },
  });
  try {
    const alice = env.authenticatedContext('alice').database();
    const bob = env.authenticatedContext('bob').database();
    const guest = env.unauthenticatedContext().database();
    const path = 'users/alice/tasks/first';
    await assertSucceeds(alice.ref(path).set({ text: 'Private task', completed: false }));
    await assertSucceeds(alice.ref(path).update({ completed: true }));
    assert.equal((await alice.ref(path).get()).val().completed, true);
    for (const client of [bob, guest]) {
      await assertFails(client.ref(path).get());
      await assertFails(client.ref(path).set({ text: 'Overwrite', completed: false }));
      await assertFails(client.ref(path).remove());
    }
    await assertFails(alice.ref('users').get());
    await assertFails(alice.ref('tasks/legacy').set({ text: 'Public', completed: false }));
    for (const value of [
      { text: '', completed: false }, { text: '   ', completed: false },
      { text: 'x'.repeat(161), completed: false }, { text: 'Task' },
      { text: 'Task', completed: 'yes' }, { text: 'Task', completed: false, owner: 'bob' },
    ]) await assertFails(alice.ref(path).set(value));
    await assertSucceeds(alice.ref(path).remove());
    assert.equal((await alice.ref(path).get()).exists(), false);
  } finally { await env.cleanup(); }
});

test('Auth emulator registration, login, and authenticated database CRUD', async () => {
  async function authRequest(action, body) {
    const response = await fetch(`http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:${action}?key=demo-local-key`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    assert.equal(response.status, 200);
    return response.json();
  }
  const email = `demo-${Date.now()}@example.test`;
  const credentials = { email, password: 'local-test-password', returnSecureToken: true };
  const user = await authRequest('signUp', credentials);
  const login = await authRequest('signInWithPassword', credentials);
  assert.equal(user.localId, login.localId);
  const base = `http://127.0.0.1:9000/users/${login.localId}/tasks/demo.json?ns=demo-focus-default-rtdb`;
  const url = `${base}&auth=${login.idToken}`;
  for (const [method, body] of [['PUT', { text: 'Finish demo', completed: false }], ['PATCH', { completed: true }]]) {
    const response = await fetch(url, { method, body: JSON.stringify(body) });
    assert.equal(response.status, 200);
  }
  assert.equal((await (await fetch(url)).json()).completed, true);
  assert.equal((await fetch(base)).status, 401);
  assert.equal((await fetch(url, { method: 'DELETE' })).status, 200);

  // Exercise the same SDK and task API used by the actual application.
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'demo-local-key';
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'demo-focus';
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL = 'https://demo-focus-default-rtdb.firebaseio.com';
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS = 'true';
  const { firebaseServices } = await import('../src/app/lib/firebase.ts');
  const { getTasks, createTask, setTaskCompleted, removeTask } = await import('../src/app/lib/task-api.ts');
  const { auth } = firebaseServices();
  try {
    await signInWithEmailAndPassword(auth, email, credentials.password);
    const task = await createTask('  SDK integration task  ');
    assert.equal(task.text, 'SDK integration task');
    await setTaskCompleted(task.id, true);
    assert.equal((await getTasks()).find(item => item.id === task.id).completed, true);
    await removeTask(task.id);
    assert.deepEqual(await getTasks(), []);
    await signOut(auth);
    await assert.rejects(getTasks(), /Sign in/);
  } finally { await deleteApp(auth.app); }
});
