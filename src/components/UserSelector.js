// src/components/UserSelector.js
import React, { useState } from 'react';

const UserSelector = ({ onSelectUser }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSelectUser(username);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="w-full px-3 py-2 border rounded-md"
      />
      <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
        Start Tracking
      </button>
    </form>
  );
};

export default UserSelector;