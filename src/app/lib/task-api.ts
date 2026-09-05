import { get, push, ref, remove, set, update } from 'firebase/database';
import type { Task } from '@/shared/types';
import { normalizeTaskText, parseTaskCollection } from './task-data.ts';
import { firebaseServices } from './firebase.ts';

function tasksRef(id?: string) {
  const { auth, database } = firebaseServices();
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to access your tasks.');
  if (id && /[.#$\[\]/]/.test(id)) throw new Error('Invalid task identifier.');
  return ref(database, `users/${user.uid}/tasks${id ? `/${id}` : ''}`);
}

export async function getTasks(signal?: AbortSignal): Promise<Task[]> {
  const snapshot = await get(tasksRef());
  signal?.throwIfAborted();
  return parseTaskCollection(snapshot.val());
}

export async function createTask(text: string): Promise<Task> {
  const task = { text: normalizeTaskText(text), completed: false };
  const target = push(tasksRef());
  await set(target, task);
  return { id: target.key!, ...task };
}

export async function setTaskCompleted(id: string, completed: boolean): Promise<void> {
  await update(tasksRef(id), { completed });
}

export async function removeTask(id: string): Promise<void> {
  await remove(tasksRef(id));
}
