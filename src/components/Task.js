import React from 'react';

const Task = ({ task, onComplete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
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
    </div>
  );
};

export default Task;