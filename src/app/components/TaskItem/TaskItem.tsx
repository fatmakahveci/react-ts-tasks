'use client';

import type { TaskItemProps } from '@/shared/types';
import type { FC } from 'react';
import './TaskItem.css';

const TaskItem: FC<TaskItemProps> = ({ task, busy, onToggle, onDelete }) => (
  <li className={`task${task.completed ? ' task--completed' : ''}`}>
    <button
      className="task__toggle"
      type="button"
      onClick={() => onToggle(task)}
      disabled={busy}
      aria-label={task.completed ? `${task.text} görevini geri al` : `${task.text} görevini tamamla`}
      aria-pressed={task.completed}
    >
      <span aria-hidden="true">{task.completed ? '✓' : ''}</span>
    </button>
    <span className="task__text">{task.text}</span>
    <button
      className="task__delete"
      type="button"
      onClick={() => onDelete(task)}
      disabled={busy}
      aria-label={`${task.text} görevini sil`}
    >
      {busy ? '…' : 'Sil'}
    </button>
  </li>
);

export default TaskItem;
