import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:8080/api/",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    }
});

export default axiosInstance;