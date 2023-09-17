"use client";


import React, { useEffect, useState } from 'react';
import Tasks from '@/app/components/Tasks/Tasks';
import NewTask from '@/app/components/NewTasks/NewTasks';
import './globals.css';

const Home = ({ }): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async (taskText: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://react-ts-tasks-e42eb-default-rtdb.firebaseio.com/tasks.json'
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data: Record<string, string>[] = await response.json();

      const loadedTasks: any = [];

      for (const taskKey in data) {
        loadedTasks.push({ id: taskKey, text: data[taskKey].text });
      }

      setTasks(loadedTasks);
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // fetchTasks();
  }, []);

  const taskAddHandler = (task: any) => {
    setTasks((prevTasks) => prevTasks.concat(task));
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