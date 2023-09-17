import { HTMLInputTypeAttribute, ReactNode, Ref } from 'react';

export type ChildrenProps = {
    children: ReactNode;
};

export type InputProps = {
    label: string;
    input: {
        id: string;
        type: HTMLInputTypeAttribute;
    };
    ref?: Ref<HTMLInputElement> | null;
};

export type NewsTasksProps = {
    onAddTask: (task: Task) => void;
};

export type Task = {
    id: string;
    text: string;
};

export type TaskFormProps = {
    loading: boolean;
    onEnterTask: any;
};

export type TasksProps = {
    error: any;
    items: Task[];
    loading: boolean;
    onFetch: any;
};