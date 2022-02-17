import axiosApi from '../../api/axios.js'

const loadProfile = async ({ state, commit }, uuid) => {
  try {
    const res = await axiosApi.get(`/users/${uuid}`)
    commit('SET_UUID', res.data.user.uuid)
    commit('SET_USERNAME', res.data.user.username)
    commit('SET_CREATED_AT', res.data.user.createdAt)
    if(res.data.user.email){
        commit('SET_EMAIL', res.data.user.email)
    }
  } catch(e) {
      console.error("could not load users",e)
  }
}

const setUsername = (state, username) => {
    state.username = username
}

const setUuid = (state, uuid) => {
    state.uuid = uuid
}

const setEmail = (state, email) => {
    state.email = email
}

const setCreationDate = (state, date) => {
  state.createdAt = date
}

const reset = (state) => {
  state.username = null
  state.uuid = null
  state.email = null
  state.createdAt = null
}



export default {
    namespaced: true,
    
    state: {
      username: null,
      uuid: null,
      email: null,
      createdAt: null,
    },
    mutations: {
      RESET: reset,
      SET_USERNAME: setUsername,
      SET_UUID: setUuid,
      SET_EMAIL: setEmail,
      SET_CREATED_AT: setCreationDate
    },
    getters: {

    },
    actions: {
        loadProfile,
    }
  }