import axios from 'axios';

const API_URL = 'https://planmycontent.onrender.com/api/dashboard';

export const getDashboardData = async (userId) => {
  const response = await axios.post(`${API_URL}/data`, { userId });
  return response.data;
};

export const saveIdea = async (userId, idea) => {
  const response = await axios.post(`${API_URL}/save-idea`, { userId, idea });
  return response.data;
};

export const savePlan = async (userId, planData) => {
  const response = await axios.post(`${API_URL}/save-plan`, { userId, planData });
  return response.data;
};

export const saveContent = async (userId, contentData) => {
  const response = await axios.post(`${API_URL}/save-content`, { userId, contentData });
  return response.data;
};

export const deleteIdea = async (id) => {
  const response = await axios.delete(`${API_URL}/idea/${id}`);
  return response.data;
};

export const deleteContent = async (id) => {
  const response = await axios.delete(`${API_URL}/content/${id}`);
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await axios.delete(`${API_URL}/plan/${id}`);
  return response.data;
};

