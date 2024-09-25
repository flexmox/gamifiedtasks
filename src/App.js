import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import UserSelector from './components/UserSelector';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';

const API_BASE_URL = 'http://149.248.5.175:5000/api';


function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    if (user && user._id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/tasks/${user._id}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  }, [user]);

  const fetchUserInfo = useCallback(async () => {
    if (user && user._id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${user._id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      fetchTasks();
      fetchUserInfo();
    }
  }, [user, fetchTasks, fetchUserInfo]);

  const handleSelectUser = async (username) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, { name: username });
      setUser(response.data);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleAddTask = async (taskName) => {
    if (user && user._id) {
      try {
        const response = await axios.post(`${API_BASE_URL}/tasks`, { userId: user._id, name: taskName });
        setTasks([...tasks, response.data]);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      console.log('Sending request to complete task:', taskId);
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`);
      console.log('Response from complete task:', response.data);
      setTasks(tasks.map(task => task._id === taskId ? response.data.task : task));
      setUser(prevUser => ({ ...prevUser, points: response.data.userPoints }));
    } catch (error) {
      console.error('Error updating task:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            {!user || !user._id ? (
              <UserSelector onSelectUser={handleSelectUser} />
            ) : (
              <>
                <h1 className="text-2xl font-semibold mb-2">{user.name}'s Tasks</h1>
                <p className="text-xl mb-4">Points: {user.points}</p>
                <AddTask onAddTask={handleAddTask} />
                <TaskList tasks={tasks} onCompleteTask={handleCompleteTask} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;