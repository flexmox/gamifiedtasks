// src/components/AddTask.js
import React, { useState } from 'react';

const AddTask = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAddTask(taskName);
      setTaskName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter new task"
        className="w-full px-3 py-2 border rounded-md"
      />
      <button type="submit" className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">
        Add Task
      </button>
    </form>
  );
};
 
export default AddTask;