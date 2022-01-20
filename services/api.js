import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://e9ab-191-5-234-123.ngrok.io/'
    baseURL: 'http://localhost:8314/'
});


export default api;
