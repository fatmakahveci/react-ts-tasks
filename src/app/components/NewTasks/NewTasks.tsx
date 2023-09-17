'use client';

import TaskForm from '@/app/components/TaskForm/TaskForm';
import Section from '@/app/components/UI/Section/Section';
import { NewsTasksProps, Task } from '@/shared/types';
import { FC, useState, ReactNode } from 'react';
import './NewTasks.css';

const NewTask: FC<NewsTasksProps> = ({ onAddTask }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ReactNode>(null);

  const enterTaskHandler = async (taskText: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: Response = await fetch(
        'https://react-ts-tasks-e42eb-default-rtdb.firebaseio.com/tasks.json',
        {
          method: 'POST',
          body: JSON.stringify({ text: taskText }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data: any = await response.json();

      const generatedId: string = data.name;
      const createdTask: Task = { id: generatedId, text: taskText };

      onAddTask(createdTask);
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;