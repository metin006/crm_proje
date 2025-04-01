// src/api/auth.js
import axios from 'axios';

const BASE_URL = 'http://135.181.42.5:214';

export const login = async (data) => {
  const response = await axios.post(`${BASE_URL}/authentication/sign-in`, data);
  

  const { accessToken } = response.data;
  if (accessToken) {
    localStorage.setItem('token', accessToken);
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
