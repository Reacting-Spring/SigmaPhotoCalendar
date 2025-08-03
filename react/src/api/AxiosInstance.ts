import axios from "axios";
import useAuthStore from "../store/AuthStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});

// 요청 인터셉터: access_token 자동 헤더 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().access_token;
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 처리 및 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401이고, 재시도 플래그가 없고, /refresh가 아닌 경우만
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosInstance.post("/refresh");
        const { access_token } = refreshResponse.data;
        if (access_token) {
          useAuthStore.getState().setAccessToken(access_token);
          // Authorization 헤더 갱신
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
          // 원래 요청 재시도
          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // /refresh도 401이면 로그아웃 처리
        const err = refreshError as any;
        if (err.response && err.response.status === 401) {
          useAuthStore.getState().clearAccessToken();
          // window.location.href 대신 React Router의 navigate를 사용하기 위해 이벤트 발생
          window.dispatchEvent(new CustomEvent("auth-expired"));
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
