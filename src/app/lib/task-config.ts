const TASKS_PATH_SUFFIX = '/tasks.json';

export const resolveTasksUrl = (
  configuredUrl = process.env.NEXT_PUBLIC_FIREBASE_TASKS_URL,
): string => {
  const value = configuredUrl?.trim();

  if (!value) {
    throw new Error(
      'Task storage is not configured. Add NEXT_PUBLIC_FIREBASE_TASKS_URL to .env.local.',
    );
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('NEXT_PUBLIC_FIREBASE_TASKS_URL must be a valid URL.');
  }

  const isLocalHttp = url.protocol === 'http:'
    && ['localhost', '127.0.0.1'].includes(url.hostname);

  if (url.protocol !== 'https:' && !isLocalHttp) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_TASKS_URL must use HTTPS, except for local emulators.',
    );
  }

  url.pathname = url.pathname.replace(/\/+$/, '');
  url.search = '';
  url.hash = '';

  if (!url.pathname.endsWith(TASKS_PATH_SUFFIX)) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_TASKS_URL must end with /tasks.json.',
    );
  }

  return url.toString();
};
