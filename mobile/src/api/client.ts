import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Para Android use o IP da sua máquina
// Para encontrar: ipconfig (Windows) ou ifconfig (Mac/Linux)
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api/v1', // 10.0.2.2 = localhost do Android Emulator
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 204) {
      return Promise.resolve({ status: 204, data: null });
    }

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
    }
    return Promise.reject(error);
  },
);

export default api;
