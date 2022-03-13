import axios from 'axios'

const authClient = axios.create({
    baseURL: `${process.env.VUE_APP_AUTH_API_URL}:${process.env.VUE_APP_AUTH_API_PORT}/`,
    headers: {
      "Accept": "application/json",
      "timeout": 1000
    },
});

const apiClient = axios.create({
    baseURL: `${process.env.VUE_APP_AUTH_API_URL}:${process.env.VUE_APP_AUTH_API_PORT}/`,
    headers: {
      "Accept": "application/json",
      "timeout": 1000
    },
});

export default apiClient
export { authClient }