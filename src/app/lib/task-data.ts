import type { Task } from '@/shared/types';

export const TASK_TEXT_MAX_LENGTH = 160;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const normalizeTaskText = (value: string): string => {
  const normalizedText = value.trim();

  if (!normalizedText) throw new Error('Task text cannot be empty.');
  if (normalizedText.length > TASK_TEXT_MAX_LENGTH) {
    throw new Error(`Task text cannot exceed ${TASK_TEXT_MAX_LENGTH} characters.`);
  }

  return normalizedText;
};

export const parseTaskCollection = (data: unknown): Task[] => {
  if (data === null) return [];
  if (!isRecord(data)) throw new Error('The server returned invalid task data.');

  return Object.entries(data).flatMap(([id, value]) => {
    if (!isRecord(value) || typeof value.text !== 'string') return [];

    let text: string;
    try {
      text = normalizeTaskText(value.text);
    } catch {
      return [];
    }

    return [{
      id,
      text,
      // Records created by older versions may not have a completion state.
      completed: value.completed === true,
    }];
  });
};

export const parseCreatedTaskId = (data: unknown): string => {
  if (!isRecord(data) || typeof data.name !== 'string' || !data.name) {
    throw new Error('The created task did not return a valid ID.');
  }

  return data.name;
};
