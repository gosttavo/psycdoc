import axios from 'axios';

const api = axios.create({
    baseURL: 'https://psycdoc.up.railway.app',
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api;