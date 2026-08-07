import type { HTMLInputTypeAttribute, ReactNode, Ref } from 'react';

export type ChildrenProps = {
  children: ReactNode;
};

export type InputProps = {
  label: string;
  input: {
    id: string;
    type: HTMLInputTypeAttribute;
    placeholder?: string;
  };
  ref?: Ref<HTMLInputElement> | null;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type NewTaskProps = {
  onAddTask: (task: Task) => void;
};

export type TaskFormProps = {
  loading: boolean;
  onEnterTask: (text: string) => Promise<boolean>;
};

export type TaskItemProps = {
  task: Task;
  busy: boolean;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export type TasksProps = {
  error: Error | null;
  items: Task[];
  loading: boolean;
  busyTaskId: string | null;
  onFetch: () => void;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export type RequestConfig = {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
};

export type UseHttpReturnType = {
  isLoading: boolean;
  error: Error | null;
  sendRequest: (
    config: RequestConfig,
    applyData?: (data: unknown) => void,
  ) => Promise<boolean>;
};
