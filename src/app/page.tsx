'use client';

import NewTask from '@/app/components/NewTasks/NewTasks';
import Tasks from '@/app/components/Tasks/Tasks';
import {
  createTask,
  getTasks,
  removeTask,
  setTaskCompleted,
} from '@/app/lib/task-api';
import type { Task } from '@/shared/types';
import { useCallback, useEffect, useRef, useState } from 'react';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred.';

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingTaskIds, setPendingTaskIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const pendingTaskIdsRef = useRef(new Set<string>());

  const loadTasks = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);

    try {
      setTasks(await getTasks());
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void getTasks(controller.signal)
      .then(setTasks)
      .catch((error: unknown) => {
        if (!isAbortError(error)) setLoadError(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const handleCreateTask = async (text: string): Promise<boolean> => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const task = await createTask(text);
      setTasks((currentTasks) => [...currentTasks, task]);
      return true;
    } catch (error) {
      setCreateError(getErrorMessage(error));
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const runTaskAction = async (
    taskId: string,
    action: () => Promise<void>,
  ): Promise<void> => {
    if (pendingTaskIdsRef.current.has(taskId)) return;

    pendingTaskIdsRef.current.add(taskId);
    setPendingTaskIds(new Set(pendingTaskIdsRef.current));
    setActionError(null);

    try {
      await action();
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      pendingTaskIdsRef.current.delete(taskId);
      setPendingTaskIds(new Set(pendingTaskIdsRef.current));
    }
  };

  const handleToggleTask = (task: Task): void => {
    const completed = !task.completed;
    void runTaskAction(task.id, async () => {
      await setTaskCompleted(task.id, completed);
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id ? { ...item, completed } : item,
        ),
      );
    });
  };

  const handleDeleteTask = (task: Task): void => {
    void runTaskAction(task.id, async () => {
      await removeTask(task.id);
      setTasks((currentTasks) =>
        currentTasks.filter((item) => item.id !== task.id),
      );
    });
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">DAILY FOCUS</p>
        <h1>Simplify your tasks.</h1>
        <p>Add your to-dos, track your progress, and lighten your day.</p>
        <div className="stats" aria-live="polite">
          <span><strong>{tasks.length}</strong> total</span>
          <span><strong>{completedCount}</strong> completed</span>
        </div>
      </header>

      <NewTask
        isCreating={isCreating}
        error={createError}
        onCreateTask={handleCreateTask}
      />
      <Tasks
        tasks={tasks}
        isLoading={isLoading}
        loadError={loadError}
        actionError={actionError}
        pendingTaskIds={pendingTaskIds}
        onRetry={() => void loadTasks()}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />
    </main>
  );
};

export default Home;
