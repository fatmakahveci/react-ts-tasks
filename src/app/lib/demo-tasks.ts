import type { Task } from '@/shared/types';
import { normalizeTaskText } from './task-data.ts';

export const DEMO_STORAGE_KEY = 'focus.demo.tasks.v1';
type TaskStorage = Pick<Storage, 'getItem' | 'setItem'>;

const samples: Task[] = [
  { id: 'demo-plan', text: 'Plan your three priorities for today', completed: false },
  { id: 'demo-break', text: 'Take a screen-free break', completed: false },
  { id: 'demo-start', text: 'Try your new focus workspace', completed: true },
];

export function createDemoTaskStore(storage: () => TaskStorage) {
  function save(tasks: Task[]) {
    try {
      storage().setItem(DEMO_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      throw new Error('Your browser could not save these tasks. Allow site storage or free up space, then try again.');
    }
  }

  function read(): Task[] {
    let raw: string | null;
    try {
      raw = storage().getItem(DEMO_STORAGE_KEY);
    } catch {
      throw new Error('Browser storage is unavailable. Allow site storage, then retry.');
    }
    if (raw === null) {
      const tasks = samples.map((task) => ({ ...task }));
      save(tasks);
      return tasks;
    }
    try {
      const data: unknown = JSON.parse(raw);
      if (!Array.isArray(data)) throw new Error('Invalid collection');
      const ids = new Set<string>();
      return data.map((value: unknown) => {
        if (typeof value !== 'object' || value === null ||
          !('id' in value) || typeof value.id !== 'string' || !value.id || ids.has(value.id) ||
          !('text' in value) || typeof value.text !== 'string' ||
          !('completed' in value) || typeof value.completed !== 'boolean') {
          throw new Error('Invalid task');
        }
        ids.add(value.id);
        return { id: value.id, text: normalizeTaskText(value.text), completed: value.completed };
      });
    } catch {
      throw new Error('Saved demo data is invalid. Clear this site’s storage to start again. Your saved data has not been overwritten.');
    }
  }

  return {
    async getTasks(signal?: AbortSignal): Promise<Task[]> {
      signal?.throwIfAborted();
      return read();
    },
    async createTask(text: string): Promise<Task> {
      const normalized = normalizeTaskText(text);
      const tasks = read();
      const task = { id: crypto.randomUUID(), text: normalized, completed: false };
      save([...tasks, task]);
      return task;
    },
    async setTaskCompleted(id: string, completed: boolean): Promise<void> {
      const tasks = read();
      if (!tasks.some((task) => task.id === id)) throw new Error('Task not found. Reload to refresh your list.');
      save(tasks.map((task) => task.id === id ? { ...task, completed } : task));
    },
    async removeTask(id: string): Promise<void> {
      save(read().filter((task) => task.id !== id));
    },
  };
}

// Storage is accessed only by effects and event handlers, never during SSR.
export const demoTasks = createDemoTaskStore(() => window.localStorage);
