'use client';

import Input from '@/app/components/UI/Input/Input';
import type { TaskFormProps } from '@/shared/types';
import type { FC, FormEvent } from 'react';
import { useRef, useState } from 'react';
import './TaskForm.css';

const TaskForm: FC<TaskFormProps> = ({ loading, onEnterTask }) => {
  const taskInputRef = useRef<HTMLInputElement | null>(null);
  const [validationError, setValidationError] = useState('');

  const submitHandler = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const taskText = taskInputRef.current?.value.trim() ?? '';

    if (!taskText) {
      setValidationError('Lütfen bir görev yaz.');
      taskInputRef.current?.focus();
      return;
    }

    setValidationError('');
    const succeeded = await onEnterTask(taskText);
    if (succeeded && taskInputRef.current) {
      taskInputRef.current.value = '';
      taskInputRef.current.focus();
    }
  };

  return (
    <form className="form" onSubmit={(event) => void submitHandler(event)}>
      <Input
        label="Yeni görev"
        input={{
          id: 'new-task',
          type: 'text',
          placeholder: 'Örn. Haftalık raporu tamamla',
        }}
        ref={taskInputRef}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Ekleniyor…' : 'Görev ekle'}
      </button>
      {validationError && <p className="validation-error" role="alert">{validationError}</p>}
    </form>
  );
};

export default TaskForm;
