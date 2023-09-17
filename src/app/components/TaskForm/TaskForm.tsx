'use client';

import { FC, FormEvent, useRef } from 'react';
import './TaskForm.css';
import Input from '@/app/components/UI/Input/Input';
import { TaskFormProps } from '@/shared/types';

const TaskForm: FC<TaskFormProps> = ({ loading, onEnterTask }) => {
  const taskInputRef = useRef<HTMLInputElement | null>(null);

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!taskInputRef.current) throw new Error("Task is required");

    const enteredValue: string = taskInputRef.current.value;
    if (enteredValue.trim().length > 0) {
      onEnterTask(enteredValue);
    }
  };

  return (
    <form className="form" onSubmit={submitHandler}>
      <Input
        label=""
        input={{
          id: '',
          type: 'text',
        }}
        ref={taskInputRef}
      />
      <button>{loading ? 'Sending...' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;