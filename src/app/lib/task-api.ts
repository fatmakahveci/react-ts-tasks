import type { Task } from '@/shared/types';
import {
  normalizeTaskText,
  parseCreatedTaskId,
  parseTaskCollection,
} from './task-data';

const DEFAULT_TASKS_URL =
  'https://react-ts-tasks-e42eb-default-rtdb.firebaseio.com/tasks.json';

const configuredUrl =
  process.env.NEXT_PUBLIC_FIREBASE_TASKS_URL?.trim() || DEFAULT_TASKS_URL;

const TASKS_URL = configuredUrl.replace(/\/$/, '');
const REQUEST_TIMEOUT_MS = 10_000;

if (!TASKS_URL.endsWith('/tasks.json')) {
  throw new Error(
    'NEXT_PUBLIC_FIREBASE_TASKS_URL geçerli bir Firebase tasks.json adresi olmalıdır.',
  );
}

const taskUrl = (id: string): string =>
  `${TASKS_URL.slice(0, -'.json'.length)}/${encodeURIComponent(id)}.json`;

const request = async (url: string, init?: RequestInit): Promise<unknown> => {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = init?.signal
    ? AbortSignal.any([init.signal, timeoutSignal])
    : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(url, { ...init, signal });
  } catch (error) {
    if (timeoutSignal.aborted && !init?.signal?.aborted) {
      throw new Error('Sunucu zamanında yanıt vermedi. Lütfen tekrar deneyin.');
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(`Sunucu isteği başarısız oldu (${response.status}).`);
  }

  const data: unknown = await response.json();
  return data;
};

export const getTasks = async (signal?: AbortSignal): Promise<Task[]> => {
  const data = await request(TASKS_URL, { signal });
  return parseTaskCollection(data);
};

export const createTask = async (text: string): Promise<Task> => {
  const normalizedText = normalizeTaskText(text);
  const data = await request(TASKS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: normalizedText, completed: false }),
  });

  return {
    id: parseCreatedTaskId(data),
    text: normalizedText,
    completed: false,
  };
};

export const setTaskCompleted = async (
  id: string,
  completed: boolean,
): Promise<void> => {
  await request(taskUrl(id), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
};

export const removeTask = async (id: string): Promise<void> => {
  await request(taskUrl(id), { method: 'DELETE' });
};
