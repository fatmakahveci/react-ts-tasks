'use client';

import TaskItem from '@/app/components/TaskItem/TaskItem';
import Section from '@/app/components/UI/Section/Section';
import type { TasksProps } from '@/shared/types';
import type { FC, ReactNode } from 'react';
import './Tasks.css';

const Tasks: FC<TasksProps> = ({
  items,
  error,
  loading,
  busyTaskId,
  onFetch,
  onToggle,
  onDelete,
}) => {
  let content: ReactNode;

  if (loading) {
    content = <p className="status">Görevler yükleniyor…</p>;
  } else if (error) {
    content = (
      <div className="status status--error" role="alert">
        <p>{error.message}</p>
        <button type="button" onClick={onFetch}>Tekrar dene</button>
      </div>
    );
  } else if (items.length === 0) {
    content = (
      <div className="empty-state">
        <span aria-hidden="true">✓</span>
        <h2>Liste tertemiz</h2>
        <p>İlk görevini yukarıdaki alandan ekleyebilirsin.</p>
      </div>
    );
  } else {
    content = (
      <ul className="task-list">
        {items.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            busy={busyTaskId === task.id}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    );
  }

  return (
    <Section>
      <div className="list-heading">
        <div>
          <p className="eyebrow">LİSTEN</p>
          <h2>Bugünün görevleri</h2>
        </div>
        {items.length > 0 && <span>{items.length} görev</span>}
      </div>
      <div className="container">{content}</div>
    </Section>
  );
};

export default Tasks;
