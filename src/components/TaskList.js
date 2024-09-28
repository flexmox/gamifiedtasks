import React, { useState } from 'react';

const TaskList = ({ tasks, onComplete, onEdit }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setEditedTaskName(task.name);
  };

  const handleSave = (task) => {
    onEdit(task._id, editedTaskName);
    setEditingTask(null);
  };

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="bg-white rounded-lg shadow-md p-4"
        >
          {editingTask === task._id ? (
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={editedTaskName}
                onChange={(e) => setEditedTaskName(e.target.value)}
                className="flex-grow mr-2 p-1 border rounded"
              />
              <button
                onClick={() => handleSave(task)}
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center">
                <h3 className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.name}
                </h3>
                <button
                  onClick={() => onComplete(task._id)}
                  className={`w-6 h-6 rounded-full ${task.completed ? 'bg-blue-500' : 'border-2 border-gray-300'}`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Every {task.frequency || 'day'} - Due {task.dueDate || 'Today'}</p>
              <p className="text-sm text-gray-500 mt-1">Last: {task.lastCompleted || 'None'}</p>
              <p className="text-sm text-gray-500 mt-1">NFC URL</p>
              {!task.completed && (
                <button
                  onClick={() => handleEdit(task)}
                  className="mt-2 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;