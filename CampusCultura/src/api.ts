import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosError } from 'axios';

export const api = axios.create({
  baseURL: 'https://campuscultura-api.aaron-navarro.workers.dev/api',
});