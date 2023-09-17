'use client';

import TaskItem from '@/app/components/TaskItem/TaskItem';
import Section from '@/app/components/UI/Section/Section';
import { Task, TasksProps } from '@/shared/types';
import { FC } from 'react';
import './Tasks.css';

const Tasks: FC<TasksProps> = ({ items, error, loading, onFetch }) => {
  let taskList = <h2>No tasks found. Start adding some!</h2>;

  if (items.length > 0) {
    taskList = (
      <ul>
        {items.map((task: Task) => (
          <TaskItem key={task.id}>{task.text}</TaskItem>
        ))}
      </ul>
    );
  }

  let content: any = taskList;

  if (error) {
    content = <button onClick={onFetch}>Try again</button>;
  }

  if (loading) {
    content = 'Loading tasks...';
  }

  return (
    <Section>
      <div className="container">{content}</div>
    </Section>
  );
};

export default Tasks;