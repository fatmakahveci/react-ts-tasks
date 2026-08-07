const defaultTasksUrl =
  'https://react-ts-tasks-e42eb-default-rtdb.firebaseio.com/tasks.json';

export const tasksUrl =
  process.env.NEXT_PUBLIC_FIREBASE_TASKS_URL?.replace(/\/$/, '') ||
  defaultTasksUrl;

export const taskUrl = (id: string): string =>
  tasksUrl.replace(/tasks\.json$/, `tasks/${encodeURIComponent(id)}.json`);
