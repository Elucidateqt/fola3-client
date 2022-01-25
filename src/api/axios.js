import axios from 'axios'

const authClient = axios.create({
    baseURL: `http://localhost:3001/`,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "authorization": `Bearer ${window.localStorage.getItem('refresh_token')}`,
      "timeout": 1000
    },
});

const apiClient = axios.create({
    baseURL: `http://localhost:3001/`,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "authorization": `Bearer ${window.localStorage.getItem('access_token')}`,
      "timeout": 1000
    },
});

export default apiClient
export { authClient }