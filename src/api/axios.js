import axios from 'axios'

const authClient = axios.create({
    baseURL: `http://localhost:3001/`,
    headers: {
      "Accept": "application/json",
      "timeout": 1000
    },
});

const apiClient = axios.create({
    baseURL: `http://localhost:3001/`,
    headers: {
      "Accept": "application/json",
      "timeout": 1000
    },
});

export default apiClient
export { authClient }