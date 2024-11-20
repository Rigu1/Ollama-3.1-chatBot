import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com', // API 기본 URL 설정
  timeout: 5000, // 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
