import React, { useState, useEffect } from 'react';

const UserSelector = ({ users, onSelectUser, onCreateUser }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (users.length > 0) {
      onSelectUser(users[0]);
    }
  }, [users, onSelectUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onCreateUser(username);
    }
  };

  return (
    <div>
      {users.length > 0 && (
        <select 
          onChange={(e) => onSelectUser(users[e.target.value])} 
          className="w-full px-3 py-2 border rounded-md mb-4"
        >
          {users.map((user, index) => (
            <option key={user._id} value={index}>
              {user.name}
            </option>
          ))}
        </select>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a new username"
          className="w-full px-3 py-2 border rounded-md"
        />
        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
          Create New User
        </button>
      </form>
    </div>
  );
};

export default UserSelector;