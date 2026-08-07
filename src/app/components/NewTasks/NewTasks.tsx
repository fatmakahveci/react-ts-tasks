import TaskForm from '@/app/components/TaskForm/TaskForm';
import Section from '@/app/components/UI/Section/Section';
import './NewTasks.css';

type NewTaskProps = {
  isCreating: boolean;
  error: string | null;
  onCreateTask: (text: string) => Promise<boolean>;
};

const NewTask = ({ isCreating, error, onCreateTask }: NewTaskProps) => (
  <Section>
    <TaskForm
      isSubmitting={isCreating}
      onSubmitTask={onCreateTask}
    />
    {error && <p className="form-error" role="alert">{error}</p>}
  </Section>
);

export default NewTask;
