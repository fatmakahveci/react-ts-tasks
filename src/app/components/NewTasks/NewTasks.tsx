'use client';

import TaskForm from '@/app/components/TaskForm/TaskForm';
import Section from '@/app/components/UI/Section/Section';
import useHttp from '@/app/hooks/use-http';
import { NewsTasksProps, Task, UseHttpReturnType } from '@/shared/types';
import { FC } from 'react';
import './NewTasks.css';

const NewTask: FC<NewsTasksProps> = ({ onAddTask }) => {
  const { isLoading, error, sendRequest: sendTaskRequest }: UseHttpReturnType = useHttp();

  const createTask = (taskText: string, taskData: any) => {
    const generatedId: string = taskData.name;
    const createdTask: Task = { id: generatedId, text: taskText };

    onAddTask(createdTask);
  };

  const enterTaskHandler = async (taskText: string): Promise<void> => {
    sendTaskRequest({
      url: 'https://react-ts-tasks-e42eb-default-rtdb.firebaseio.com/tasks.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { text: taskText },
    },
    createTask.bind(null, taskText)
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error.message}</p>}
    </Section>
  );
};

export default NewTask;