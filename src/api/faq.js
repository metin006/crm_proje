import axios from 'axios';
const BASE_URL = 'http://135.181.42.5:214';
const token = localStorage.getItem('token');

const authHeader = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getFaqs = async () => {
  const response = await axios.get(`${BASE_URL}/faqs`, authHeader);
  return response.data;
};

export const addFaq = async (data) => {
  const response = await axios.post(`${BASE_URL}/faqs`, data, authHeader);
  return response.data;
};

export const updateFaq = async (data) => {
  const response = await axios.put(`${BASE_URL}/faqs`, data, authHeader);
  return response.data;
};

export const deleteFaq = async (id) => {
  const response = await axios.delete(`${BASE_URL}/faqs/${id}`, authHeader);
  return response.data;
};
