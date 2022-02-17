import axiosApi from '../../api/axios.js'


const loadOwnProfile = async ( {state, commit }) => {
    try {
      const res = await axiosApi.get('/users/me')
      if(res. data && res.data.user){
        commit('SET_PLAYER_UUID', res.data.user.uuid)
        commit('SET_PLAYER_USERNAME', res.data.user.username)
        commit('SET_PLAYER_EMAIL', res.data.user.email)
      }
    } catch (err) {
      console.error("could not load your user profile", err)
    }
}
  

const setPlayerUsername = (state, username) => {
    state.username = username
}

const setPlayerUuid = (state, uuid) => {
    state.uuid = uuid
}

const setPlayerEmail = (state, email) => {
    state.email = email
}

const resetPlayerData = (state) => {
  state.username = null
  state.uuid = null
  state.email = null
}



export default {
    namespaced: true,
    
    state: {
      username: null,
      uuid: null,
      email: null,
    },
    mutations: {
      RESET_PLAYER_DATA: resetPlayerData,
      SET_PLAYER_USERNAME: setPlayerUsername,
      SET_PLAYER_UUID: setPlayerUuid,
      SET_PLAYER_EMAIL: setPlayerEmail
    },
    getters: {

    },
    actions: {
        loadOwnProfile
    }
  }