import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `https://minexxapi-db-426415920655.us-central1.run.app`,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(`_authTkn`)
    const refresh = localStorage.getItem(`_authRfrsh`)
    const dash = localStorage.getItem(`_dash`)
    config.params = config.params || {};
    config.headers['authorization'] = token;
    config.headers['x-refresh'] = refresh;
    config.headers['x-platform'] = dash;
    return config;
});

export default axiosInstance;
