import React from "react";
import "./TodoList/TodoList.css";
import { useEventrixState } from 'eventrix';

const TodoFooter = () => {
  const [tasks] = useEventrixState<any[]>("tasks");
  const [statusFilter] = useEventrixState("filter.status");
  const tasksList = statusFilter
    ? tasks.filter((task) => task.status === statusFilter)
    : tasks;
  return <div className="todo-footer">Taks count: {tasksList.length}</div>;
};

export default TodoFooter;
