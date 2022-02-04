import axiosApi, {authClient as axiosAuth} from '../../api/axios.js'
import jwt from 'jsonwebtoken'

const signupUser = async ({ state, commit }, data) => {
    try {
        const res = await axiosAuth.post(`/auth/signup`, {
            email: data.email,
            username: data.username,
            password: data.password
        })
    } catch (err) {
        console.error('could not sign up', err)
    }
}

const loginUser = async ({ state, commit }, data) => {
  try {
    await axiosAuth.post(`/auth/login`, {email: data.email, password: data.password})
    //tokens in response are caught and saved by axios interceptor
  } catch(e) {
    console.error("could not login:",e)
  }
}

const logoutUser = async ({ state, commit }) => {
    try {
        await axiosAuth.post(`/auth/logout`)
        commit('RESET')
    } catch (err) {
        console.error('error logging out:', err)
    }
    state.users = []
    state.offset = 0
    state.hasMore = true
}

const request_new_tokens = async (state) => {
    try {
        await axiosAuth.post(`/auth/refreshToken`)
    } catch (err) {
        console.error('error refreshing tokens', err)
    }
}

const set_refresh_token = (state, payload) => {
    localStorage.setItem('refresh_token', payload.token)
    axiosAuth.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
}

function set_access_token(state, payload) {
    const expires = Date.now()+(payload.expires_in*1000)
    sessionStorage.setItem('access_token_expires', expires)
    sessionStorage.setItem('access_token', payload.token)
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
    state.accessToken = payload.token
    state.accessTokenExpires = expires
}

const get_refresh_token = () => {
    const refresh_token = localStorage.getItem('refresh_token')
    return refresh_token
}

const refresh_token_valid = (state) => {
    const refresh_token = get_refresh_token()
    if(refresh_token === null){
        return false
    }
    const payload = jwt.decode(refresh_token)
    if(Math.floor(Date.now() / 1000) > payload.exp){
        return false
    }
    return true
}

const access_token_valid = (state) => {
    const token = state.accessToken
    const expiration = state.accessTokenExpires
    if(token != undefined && expiration != undefined){
        const now = Date.now()
        if(expiration > now){
            return true
        }
    }
    return false
}

const reset = (state) => {
    localStorage.removeItem('refresh_token')
    sessionStorage.removeItem('access_token')
    state.accessToken = null
    state.accessTokenExpires = null
}

export default {
    namespaced: true,
    
    state: {
        accessToken: null,
        accessTokenExpires: null,
    },
    mutations: {
      SET_REFRESH_TOKEN: set_refresh_token,
      SET_ACCESS_TOKEN: set_access_token,
      RESET: reset
    },
    getters: {
        isRefreshTokenValid: refresh_token_valid,
        getRefreshToken: get_refresh_token,
        isAccessTokenValid: access_token_valid
    },
    actions: {
        signupUser,
        loginUser,
        logoutUser,
        request_new_tokens
    }
  }