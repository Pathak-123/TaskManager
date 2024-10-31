import axios from 'axios';
// const API_URL  = 'http://localhost:3000/api/v1/task';
const API_URL = 'https://taskmanager-backend-wv9r.onrender.com/api/v1/task';
const TaskShare_PREFIX = 'sharetask/';

export const getAnalyticsData = async () => {
    try {
      const response = await axios.get(`${API_URL}/analyticsData`,{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const createTask = async (task) => {
    try {
      const response = await axios.post(`${API_URL}/createTask`, task,{
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response.data.message || 'Create Task failed';
    }
  };

  export const updateTask = async (updateTaskData,taskId) => {
    try {
      const response = await axios.put(`${API_URL}/editTask/${taskId}`, updateTaskData,{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const getTasksData = async (period) => {
    try {
      const response = await axios.get(`${API_URL}/getTask?period=${period}`,{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${taskId}`,{
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });

      return response.data;
    } catch (error) {
      throw error.response.data.message || 'Delete Task failed';
    }
  };

  export const shareTask = async (taskId) => {
    try {
      const response = await axios.get(`${API_URL}/shareTask/${taskId}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      }
      );
      if (response.data.success) {
        return `${TaskShare_PREFIX}${response.data.taskLink}`;
      } else {
        throw new Error(response.data.message || 'Error publishing quiz');
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to publish quiz');
    }
  };

  export const getSharedTask = async (slugID) => {
    try {
      const response = await axios.get(`${API_URL}/getSharedTask/${slugID}`);
      if (response.data.success) {
        return response.data.task;
      } else {
        throw new Error(response.data.message || 'Error fetching quiz');
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch quiz');
    }
  };

  export const updateType = async (updateTaskType,taskId) => {
    try {
      const response = await axios.patch(`${API_URL}/task/${taskId}`, {updateTaskType},{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };