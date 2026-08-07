import type { Task } from '@/shared/types';
import './TaskItem.css';

type TaskItemProps = {
  task: Task;
  isPending: boolean;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const TaskItem = ({ task, isPending, onToggle, onDelete }: TaskItemProps) => (
  <li className={`task${task.completed ? ' task--completed' : ''}`}>
    <button
      className="task__toggle"
      type="button"
      onClick={() => onToggle(task)}
      disabled={isPending}
      aria-label={
        task.completed
          ? `Mark ${task.text} as incomplete`
          : `Mark ${task.text} as complete`
      }
      aria-pressed={task.completed}
    >
      <span aria-hidden="true">{task.completed ? '✓' : ''}</span>
    </button>
    <span className="task__text">{task.text}</span>
    <button
      className="task__delete"
      type="button"
      onClick={() => onDelete(task)}
      disabled={isPending}
      aria-label={`Delete ${task.text}`}
    >
      {isPending ? '…' : 'Delete'}
    </button>
  </li>
);

export default TaskItem;
