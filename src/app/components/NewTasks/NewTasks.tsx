'use client';

import TaskForm from '@/app/components/TaskForm/TaskForm';
import Section from '@/app/components/UI/Section/Section';
import useHttp from '@/app/hooks/use-http';
import { tasksUrl } from '@/app/lib/api';
import type { NewTaskProps } from '@/shared/types';
import type { FC } from 'react';
import './NewTasks.css';

type FirebasePostResponse = { name?: unknown };

const NewTask: FC<NewTaskProps> = ({ onAddTask }) => {
  const { isLoading, error, sendRequest } = useHttp();

  const enterTaskHandler = async (taskText: string): Promise<boolean> => {
    let generatedId = '';
    const succeeded = await sendRequest(
      {
        url: tasksUrl,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { text: taskText, completed: false },
      },
      (data) => {
        const response = data as FirebasePostResponse;
        if (typeof response.name === 'string') generatedId = response.name;
      },
    );

    if (succeeded && generatedId) {
      onAddTask({ id: generatedId, text: taskText, completed: false });
      return true;
    }
    return false;
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p className="form-error" role="alert">{error.message}</p>}
    </Section>
  );
};

export default NewTask;
