'use client';

import { ChildrenProps } from '@/shared/types';
import { FC } from 'react';
import './TaskItem.css';

const TaskItem: FC<ChildrenProps> = ({ children }): JSX.Element => {
  return (
    <li className="task">{children}</li>
  );
};

export default TaskItem;