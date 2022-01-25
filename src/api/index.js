import axios from "axios";
import jwt from "jsonwebtoken";
import apiClient, { authClient } from "./axios";

const createAuthClient = () => {

  authClient.interceptors.response.use(
    (res) => {
      if(res.data){
        if(res.data.access_token){
          window.localStorage.setItem('access_token', res.data.access_token)
        }
        if(res.data.refresh_token){
          window.localStorage.setItem('refresh_token', res.data.refresh_token)
        }
      }
      return res
    },
    async (err) => {
      const originalConfig = err.config
      if(err.response){
        if (err.response.status === 401 && !originalConfig._retry) {
          
        }
  
        if (err.response.status === 403 && err.response.data) {
          return Promise.reject(err.response.data);
        }
      }
    }
  )

  return authClient
}

const createApiClient = () => {

  apiClient.interceptors.response.use(
    (res) => {
      if(res.data){
        if(res.data.access_token){
          window.localStorage.setItem('access_token', res.data.access_token)
        }
        if(res.data.refresh_token){
          window.localStorage.setItem('refresh_token', res.data.refresh_token)
        }
      }
      return res
    },
    async (err) => {
      const originalConfig = err.config
      if(err.response){
        if (err.response.status === 401 && !originalConfig._retry) {
          
        }
  
        if (err.response.status === 403 && err.response.data) {
          return Promise.reject(err.response.data);
        }
      }
    }
  )


  apiClient.interceptors.request.use(
    async (config) => {
      try {
        switch (config.url) {
          case '/auth/signup':
          case '/auth/login':
          case '/health':
            break
          case '/auth/refreshToken':
          case '/auth/logout/me':
            config.headers['authorization'] = `Bearer ${window.localStorage.getItem('refresh_token')}`
            break;
          default:
            let token = window.localStorage.getItem("access_token")
            if(token){
              const payload = jwt.decode(token)
              const expiration = payload.exp
              const now = Math.floor(Date.now() / 1000)
              if(expiration < now && !config._retry){
                config._retry = true
                const rs = await axiosAuth.post('/auth/refreshToken')
                token = rs.data.access_token
              }
              config.headers['authorization'] = `Bearer ${token}`
            }
            break;
        }
        return config
        
      } catch (err) {
        console.error(err)
        return Promise.reject(err)
      }
    },
    (error) => {
      return Promise.reject(error)
    }
  )


  return apiClient
};

const axiosAuth = createAuthClient()
const axiosApi = createApiClient()

export default axiosApi
export { axiosAuth }
