import axios from "axios";
import axiosInstance from "@/api/axiosInstance";

export const saveToken = (token : string) => {
    localStorage.setItem('token' , token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const removeToken = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};


export const fetchUser = async () => {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await axiosInstance.get('/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem('userId', response.data.id);
    return response.data;
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
