import axios from "axios";

const api = axios.create({
  baseURL: "http://10.105.134.29:3000/api",
});

export default api;