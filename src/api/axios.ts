import axios, {
    // AxiosError,
    // AxiosResponse,
    // InternalAxiosRequestConfig
} from 'axios';

const api = axios.create({
    baseURL: 'https://psycdoc.up.railway.app',
    headers: {
        'Content-Type': 'application/json',
    }
})

// api.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         const accessToken = localStorage.getItem('accessToken');
//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//     },
//     (error: AxiosError) => {
//         return Promise.reject(error);
//     }
// );

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       if (error.response?.status === 401) {
//         const refreshToken = localStorage.getItem('refreshToken');
//         //const newToken = await fetchNewToken(refreshToken);
//         localStorage.setItem('accessToken', newToken);
//         error.config.headers.Authorization = `Bearer ${newToken}`;
//         return api.request(error.config); // repete a requisição
//       }
//       return Promise.reject(error);
//     }
// );

export default api;