import axios from 'axios';

const API_URL  = 'http://localhost:3000/api/v1/user';

export const registerUser = async (signUpData) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, signUpData);
      return response.data;
    } catch (error) {
      throw error.response.data.message || 'Signup failed';
    }
  };
  export const loginUser = async (loginData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, loginData);
      return response.data;
    } catch (error) {
      throw error.response.data.message || 'Login failed';
    }
  };

  export const updateUser = async (updateData) => {
    try {
      const response = await axios.put(`${API_URL}/update`, updateData,{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      throw error.response.data.message || 'Updation failed';
    }
  };

  export const addPeople = async (email) => {
    try {
      const response = await axios.put(`${API_URL}/addPeople`, { assigneEmail: email },{
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });
      return response.data;
    }catch (error) {
      throw error.response.data.message || 'Add people failed';
    }
  };
export const getAssignee = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/getPeople`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });
      return response.data.user;
    } catch (error) {
      throw error.response.data.message || 'Get Assignee failed';    }
  };