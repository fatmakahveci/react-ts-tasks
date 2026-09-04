import type { Task } from '@/shared/types';
import {
  normalizeTaskText,
  parseCreatedTaskId,
  parseTaskCollection,
} from './task-data';
import { resolveTasksUrl } from './task-config';

const REQUEST_TIMEOUT_MS = 10_000;

const taskUrl = (tasksUrl: string, id: string): string =>
  `${tasksUrl.slice(0, -'.json'.length)}/${encodeURIComponent(id)}.json`;

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
      throw new Error('The server timed out. Please try again.');
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(`The server request failed (${response.status}).`);
  }

  const data: unknown = await response.json();
  return data;
};

export const getTasks = async (signal?: AbortSignal): Promise<Task[]> => {
  const data = await request(resolveTasksUrl(), { signal });
  return parseTaskCollection(data);
};

export const createTask = async (text: string): Promise<Task> => {
  const normalizedText = normalizeTaskText(text);
  const data = await request(resolveTasksUrl(), {
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
  await request(taskUrl(resolveTasksUrl(), id), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
};

export const removeTask = async (id: string): Promise<void> => {
  await request(taskUrl(resolveTasksUrl(), id), { method: 'DELETE' });
};
