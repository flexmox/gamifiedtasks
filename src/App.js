import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSelector from './components/UserSelector';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const API_BASE_URL = 'http://149.248.5.175:5001';

  useEffect(() => {
    console.log('App component mounted. Fetching users...');
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      console.log(`Selected user changed to: ${selectedUser.name}. Fetching tasks...`);
      fetchTasks();
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    console.log(`Attempting to fetch users from ${API_BASE_URL}/api/users`);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      console.log('Users fetched successfully:', response.data);
      setUsers(response.data);
      if (response.data.length > 0) {
        setSelectedUser(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Error handling remains the same
    }
  };

  const createUser = async (username) => {
    console.log(`Attempting to create user: ${username}`);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users`, { name: username });
      console.log('User created successfully:', response.data);
      setUsers([...users, response.data]);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error creating user:', error);
      // Add error handling here
    }
  };

  /**
   * Handles user selection.
   * @param {Object} user - The selected user object
   */
    const handleSelectUser = (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
  };

  const fetchTasks = async () => {
    if (selectedUser && selectedUser._id) {
      console.log(`Attempting to fetch tasks for user ${selectedUser._id}`);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tasks/${selectedUser._id}`);
        console.log('Tasks fetched successfully:', response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        } else if (error.request) {
          console.error('No response received. Request:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
        setTasks([]);
      }
    } else {
      console.log('No user selected, clearing tasks');
      setTasks([]);
    }
  };


  /**
   * Handles adding a new task.
   * @param {string} taskName - The name of the new task
   */
  const handleAddTask = async (taskName) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tasks`, {
        name: taskName,
        userId: selectedUser._id,
      });
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
      // TODO: Show error message to user
    }
  };

  /**
   * Handles completing a task.
   * @param {string} taskId - The ID of the task to complete
   */
  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/tasks/${taskId}/complete`);
      const { task, userPoints } = response.data;
      
      setTasks(prevTasks => prevTasks.map(t => 
        t._id === taskId ? task : t
      ));
  
      // Update user points if needed
      if (userPoints !== null && selectedUser) {
        setSelectedUser(prevUser => ({...prevUser, points: userPoints}));
      }
  
      console.log('Task completed successfully:', task);
    } catch (error) {
      console.error('Error completing task:', error);
      // TODO: Show error message to user
    }
  };

  /**
   * Handles editing a task.
   * @param {string} taskId - The ID of the task to edit
   * @param {string} newName - The new name for the task
   */
  const handleEditTask = async (taskId, newName) => {
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, { name: newName });
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, name: newName } : task
      ));
    } catch (error) {
      console.error('Error editing task:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Task Tracker</h1>
      <UserSelector 
        users={users} 
        onSelectUser={handleSelectUser} 
        onCreateUser={createUser}
      />
      {selectedUser && (
        <>
          <AddTask onAddTask={handleAddTask} />
          <TaskList 
            tasks={tasks} 
            onComplete={handleCompleteTask} 
            onEdit={handleEditTask}
          />
        </>
      )}
    </div>
  );
};

export default App;