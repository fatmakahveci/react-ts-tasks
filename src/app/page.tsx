'use client';

import NewTask from '@/app/components/NewTasks/NewTasks';
import Tasks from '@/app/components/Tasks/Tasks';
import { Task, UseHttpReturnType } from '@/shared/types';
import { useEffect, useState } from 'react';
import './globals.css';
import useHttp from './hooks/use-http';

const Home = (): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { isLoading, error, sendRequest: fetchTasks }: UseHttpReturnType = useHttp();

  useEffect(() => {
    const transformTasks = (tasksObj: Record<string, any>): void => {
      const loadedTasks: Task[] = [];
      for (const taskKey in tasksObj) {
        loadedTasks.push({id: taskKey, text: tasksObj[taskKey].text});
      }
      setTasks(loadedTasks);
    };
  
    fetchTasks(
      {url: 'https://react-ts-tasks-e42eb-default-rtdb.firebaseio.com/tasks.json'},
      transformTasks
    );
  }, [fetchTasks]);

  const taskAddHandler = (task: Task): void => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  return (
    <>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </>
  );
}

export default Home;