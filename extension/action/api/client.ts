import axios, { AxiosError } from 'axios';

const EXTENSION_PUBLIC_API_URL = process.env.EXTENSION_PUBLIC_API_URL || 'http://localhost:3001';

// 使用空的 baseURL，让请求通过 Vite 的代理
export const apiClient = axios.create({
    baseURL: EXTENSION_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器：添加 token
apiClient.interceptors.request.use(
    async (config) => {
        const storage = await chrome.storage.local.get("ankicode-extension-edge");
        const data = storage["data"];
        if (data && data.token && data.user) {
            config.headers.Authorization = `Bearer ${data.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token 过期或无效，清除并重定向到登录页
            chrome.storage.local.remove("ankicode-extension-edge");
        }
        return Promise.reject(error);
    }
);

export default apiClient;
