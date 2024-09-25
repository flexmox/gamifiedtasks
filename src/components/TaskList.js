// src/components/TaskList.js
import React from 'react';

const TaskList = ({ tasks, onCompleteTask }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add a task to get started!</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onCompleteTask(task._id)}
                className="h-5 w-5"
              />
              <span className={task.completed ? 'line-through' : ''}>{task.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;