'use client';

import Section from '@/app/components/UI/Section/Section';
import TaskItem from '@/app/components/TaskItem/TaskItem';
import './Tasks.css';

const Tasks = (props: any) => {
  let taskList = <h2>No tasks found. Start adding some!</h2>;

  if (props.items.length > 0) {
    taskList = (
      <ul>
        {/* {props.items.map((task) => (
          <TaskItem key={task.id}>{task.text}</TaskItem>
        ))} */}
      </ul>
    );
  }

  let content = taskList;

  if (props.error) {
    content = <button onClick={props.onFetch}>Try again</button>;
  }

  if (props.loading) {
    // content = 'Loading tasks...';
  }

  return (
    <Section>
      <div className="container">{content}</div>
    </Section>
  );
};

export default Tasks;