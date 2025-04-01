import axios from 'axios';

const BASE_URL = 'http://135.181.42.5:214';
const token = localStorage.getItem('token');

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}/categories`, config);
  return response.data;
};

export const createCategory = async (formData) => {
  return await axios.post(`${BASE_URL}/categories`, formData, config);
};

export const updateCategory = async ({ id, data }) => {
  return await axios.put(`${BASE_URL}/categories`, data, config); 
};

export const deleteCategory = async (id) => {
  return await axios.delete(`${BASE_URL}/categories/${id}`, config);
};
