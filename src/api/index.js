import store from "../store";
import apiClient, { authClient } from "./axios";

const handleErrors = (err) => {
  if(err.response){
    const alertConfig = {
      type: "negative",
      message: `errors.http.${err.response.status}`,
      visible: true
    }
    store.commit("alert/SET_ALERT_CONFIG", alertConfig)
  }
}

export default function createAxiosPlugin() {
  return (store) => {

    authClient.interceptors.response.use(
      (res) => {
        if(res.data){
          if(res.data.access_token){
            store.commit('auth/SET_ACCESS_TOKEN', {token: res.data.access_token, expires_in: res.data.expires_in})
          }
          if(res.data.refresh_token){
            store.commit('auth/SET_REFRESH_TOKEN', {token: res.data.refresh_token})
          }
        }
        return res
      },
      async (err) => {
        handleErrors(err)
        throw new Error(err)
      }
    )

    apiClient.interceptors.response.use(
      (res) => {
        if(res.data){
          if(res.data.access_token){
            store.commit('auth/SET_ACCESS_TOKEN', {token: res.data.access_token, expires_in: res.data.expires_in})
          }
          if(res.data.refresh_token){
            store.commit('auth/SET_REFRESH_TOKEN', {token: res.data.access_token})
          }
        }
        return res
      },
      async (err) => {
        handleErrors(err)
        throw new Error(err)
      }
    )
    
    
    apiClient.interceptors.request.use(
      async (config) => {
        try {
          const tokenValid = store.getters['auth/isAccessTokenValid']
          if(tokenValid){
            return config
          }
          const refreshTokenValid = store.getters['auth/isRefreshTokenValid']
          if(!refreshTokenValid){
            return Promise.reject('error getting new tokens: refresh token invalid')
          }
          const res = await authClient.post('/auth/refreshToken')
          if(!res || !res.status){
            return Promise.reject('automatic token refresh failed with status', res.status)
          }
          config['headers']['Authorization'] = `Bearer ${res.data.access_token}`
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
  }
}
