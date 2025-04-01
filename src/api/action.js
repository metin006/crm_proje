// src/api/action.js
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BASE_URL = 'http://135.181.42.5:214';
const getToken = () => localStorage.getItem('token');

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ✅ GET
export const useGetActions = () => {
  return useQuery({
    queryKey: ['actions'],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/actions`, authHeader());
      return res.data;
    },
  });
};

// ✅ CREATE
export const useCreateAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      return await axios.post(`${BASE_URL}/actions`, formData, authHeader());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['actions']);
    },
  });
};

// ✅ UPDATE
export const useUpdateAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await axios.put(`${BASE_URL}/actions`, data, authHeader());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['actions']);
    },
  });
};

// ✅ DELETE
export const useDeleteAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`${BASE_URL}/actions/${id}`, authHeader());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['actions']);
    },
  });
};
