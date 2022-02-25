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
      throw new Error(err)
    }
}

const updateOwnPassword = async (state, data) => {
  try {
    await axiosApi.put('/users/me/password', {"password": data.password})
  } catch (e) {
    throw new Error(err)
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

const getPlayerData = (state) => {
  return {
    username: state.username,
    uuid: state.uuid,
    email: state.email
  }
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
      getPlayerData
    },
    actions: {
        loadOwnProfile,
        updateOwnPassword
    }
  }