import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = "https://flask-api-jy16.onrender.com";

// Generic GET hook (your original)
export const useApi = (endpoint, trigger = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(trigger);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`);
      setData(response);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (trigger) {
      fetchData();
    }
  }, [fetchData, trigger]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for checking if user is blocked (GET)
export const useIsBlocked = (userId, trigger = false) => {
  const endpoint = `/is_blocked?id=${userId}`;
  return useApi(endpoint, trigger);
};

// Hook that returns a function to block a user (POST)
export const useBlockUser = () => {
  const blockUser = async (userId) => {
    try {
      const response = await axios.post(`${API_BASE}/block`, null, {
        params: { id: userId },
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  };
  return { blockUser };
};

// Hook that returns a function to unblock a user (POST)
export const useUnblockUser = () => {
  const unblockUser = async (userId) => {
    try {
      const response = await axios.post(`${API_BASE}/unblock`, null, {
        params: { id: userId },
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  };
  return { unblockUser };
};

// Hook that returns a function to delete a user (DELETE)
export const useDeleteUser = () => {
  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE}/delete`, {
        params: { id: userId },
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  };
  return { deleteUser };
};
