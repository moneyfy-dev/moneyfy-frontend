import axios from 'axios';
import getEnvVars from '../../../config';

const { apiUrl } = getEnvVars();

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});