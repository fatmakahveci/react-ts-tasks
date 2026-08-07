'use client';

import NewTask from '@/app/components/NewTasks/NewTasks';
import Tasks from '@/app/components/Tasks/Tasks';
import useHttp from '@/app/hooks/use-http';
import { taskUrl, tasksUrl } from '@/app/lib/api';
import type { Task } from '@/shared/types';
import { useCallback, useEffect, useState } from 'react';

type FirebaseTask = {
  text?: unknown;
  completed?: unknown;
};

const Home = (): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const { isLoading, error, sendRequest } = useHttp();

  const fetchTasks = useCallback((): void => {
    void sendRequest({ url: tasksUrl }, (data) => {
      const tasksObject = (data ?? {}) as Record<string, FirebaseTask>;
      const loadedTasks = Object.entries(tasksObject)
        .filter(([, task]) => typeof task?.text === 'string')
        .map(([id, task]) => ({
          id,
          text: task.text as string,
          completed: task.completed === true,
        }));

      setTasks(loadedTasks);
    });
  }, [sendRequest]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = async (task: Task): Promise<void> => {
    setBusyTaskId(task.id);
    const completed = !task.completed;
    const succeeded = await sendRequest({
      url: taskUrl(task.id),
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: { completed },
    });

    if (succeeded) {
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id ? { ...item, completed } : item,
        ),
      );
    }
    setBusyTaskId(null);
  };

  const deleteTask = async (task: Task): Promise<void> => {
    setBusyTaskId(task.id);
    const succeeded = await sendRequest({
      url: taskUrl(task.id),
      method: 'DELETE',
    });

    if (succeeded) {
      setTasks((currentTasks) =>
        currentTasks.filter((item) => item.id !== task.id),
      );
    }
    setBusyTaskId(null);
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">GÜNLÜK ODAK</p>
        <h1>Görevlerini sadeleştir.</h1>
        <p>Yapacaklarını ekle, ilerlemeni gör ve gününü hafiflet.</p>
        <div className="stats" aria-live="polite">
          <span><strong>{tasks.length}</strong> toplam</span>
          <span><strong>{completedCount}</strong> tamamlandı</span>
        </div>
      </header>

      <NewTask onAddTask={(task) => setTasks((current) => [...current, task])} />
      <Tasks
        items={tasks}
        loading={isLoading && busyTaskId === null}
        error={error}
        busyTaskId={busyTaskId}
        onFetch={fetchTasks}
        onToggle={(task) => void toggleTask(task)}
        onDelete={(task) => void deleteTask(task)}
      />
    </main>
  );
};

export default Home;
