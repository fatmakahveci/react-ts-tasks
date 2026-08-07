'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import {
  normalizeTaskText,
  TASK_TEXT_MAX_LENGTH,
} from '@/app/lib/task-data';
import './TaskForm.css';

type TaskFormProps = {
  isSubmitting: boolean;
  onSubmitTask: (text: string) => Promise<boolean>;
};

const TaskForm = ({ isSubmitting, onSubmitTask }: TaskFormProps) => {
  const [taskText, setTaskText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    let normalizedText: string;
    try {
      normalizedText = normalizeTaskText(taskText);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : 'Invalid task text.',
      );
      return;
    }

    setValidationError(null);
    const succeeded = await onSubmitTask(normalizedText);
    if (succeeded) setTaskText('');
  };

  return (
    <form
      className="form"
      aria-busy={isSubmitting}
      onSubmit={(event) => void handleSubmit(event)}
    >
      <div className="input">
        <label htmlFor="new-task">New task</label>
        <input
          id="new-task"
          type="text"
          value={taskText}
          placeholder="e.g. Finish the weekly report"
          maxLength={TASK_TEXT_MAX_LENGTH}
          disabled={isSubmitting}
          aria-describedby={validationError ? 'task-validation-error' : undefined}
          aria-invalid={Boolean(validationError)}
          onChange={(event) => {
            setTaskText(event.target.value);
            if (validationError) setValidationError(null);
          }}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding…' : 'Add task'}
      </button>
      {validationError && (
        <p id="task-validation-error" className="validation-error" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
};

export default TaskForm;
