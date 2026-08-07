import TaskItem from '@/app/components/TaskItem/TaskItem';
import Section from '@/app/components/UI/Section/Section';
import type { Task } from '@/shared/types';
import type { ReactNode } from 'react';
import './Tasks.css';

type TasksProps = {
  tasks: Task[];
  isLoading: boolean;
  loadError: string | null;
  actionError: string | null;
  pendingTaskIds: ReadonlySet<string>;
  onRetry: () => void;
  onToggleTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
};

const Tasks = ({
  tasks,
  isLoading,
  loadError,
  actionError,
  pendingTaskIds,
  onRetry,
  onToggleTask,
  onDeleteTask,
}: TasksProps) => {
  let content: ReactNode;

  if (isLoading) {
    content = <p className="status">Loading tasks…</p>;
  } else if (loadError) {
    content = (
      <div className="status status--error" role="alert">
        <p>{loadError}</p>
        <button type="button" onClick={onRetry}>Try again</button>
      </div>
    );
  } else if (tasks.length === 0) {
    content = (
      <div className="empty-state">
        <span aria-hidden="true">✓</span>
        <h2>Your list is clear</h2>
        <p>Add your first task using the form above.</p>
      </div>
    );
  } else {
    content = (
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isPending={pendingTaskIds.has(task.id)}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
          />
        ))}
      </ul>
    );
  }

  return (
    <Section>
      <div className="list-heading">
        <div>
          <p className="eyebrow">YOUR LIST</p>
          <h2>Today&apos;s tasks</h2>
        </div>
        {tasks.length > 0 && <span>{tasks.length} tasks</span>}
      </div>
      {actionError && (
        <p className="action-error" role="alert">{actionError}</p>
      )}
      <div className="container">{content}</div>
    </Section>
  );
};

export default Tasks;
