// utils/api.js

import axios from "axios";

// Switch between dev and production
const BASE_URL = "https://reliefgoods.pythonanywhere.com/api";

// "http://192.168.100.57:8000/api"
// "https://reliefgoods.pythonanywhere.com/api"

// Change this to PROD_BASE_URL when deploying
const API_BASE_URL = BASE_URL;

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;
