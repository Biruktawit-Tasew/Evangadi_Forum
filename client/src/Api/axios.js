import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:2017/api",
});

export default axiosInstance;
