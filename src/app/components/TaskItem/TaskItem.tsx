import './TaskItem.css';

const TaskItem = (props: any) => {
  return (
    <li className="task">{props.children}</li>
  );
};

export default TaskItem;