import axiosApi from '../../api/axios.js'


const loadOwnProfile = async ( {state, commit }) => {
    try {
      const res = await axiosApi.get('/users/me')
      if(res. data && res.data.user){
        commit('SET_PLAYER_UUID', res.data.user.uuid)
        commit('SET_PLAYER_USERNAME', res.data.user.username)
        commit('SET_PLAYER_EMAIL', res.data.user.email)
        commit('SET_PLAYER_PERMISSIONS', res.data.user.permissions)
        commit('SET_PLAYER_ROLES', res.data.user.roles)
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

const loadOwnPermissions = async ({ state, commit }) => {
  try {
      const res = await axiosApi.get(`/permissions/my`)
      commit('SET_PLAYER_PERMISSIONS', res.data.permissions)
  } catch (err) {
      throw new Error(err)
  }
}

const setPlayerRoles = (state, roles) => {
  state.roles = roles
}

const setPlayerPermissions = (state, permissions) => {
  state.permissions = permissions
}

const userHasPermission = ( state ) => ( permissionName ) => {
  return state.permissions && state.permissions.some(permission => permission.name === permissionName)
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
  state.permissions = null
  state.roles = null
}

const getPlayerData = (state) => {
  return {
    username: state.username,
    uuid: state.uuid,
    email: state.email,
    permissions: state.permissions,
    roles: state.roles
  }
}



export default {
    namespaced: true,
    
    state: {
      username: null,
      uuid: null,
      email: null,
      roles: null,
      permissions: null,
      roles: null
    },
    mutations: {
      RESET_PLAYER_DATA: resetPlayerData,
      SET_PLAYER_USERNAME: setPlayerUsername,
      SET_PLAYER_UUID: setPlayerUuid,
      SET_PLAYER_EMAIL: setPlayerEmail,
      SET_PLAYER_PERMISSIONS: setPlayerPermissions,
      SET_PLAYER_ROLES: setPlayerRoles
    },
    getters: {
      getPlayerData,
      userHasPermission
    },
    actions: {
        loadOwnProfile,
        loadOwnPermissions,
        updateOwnPassword,
        resetPlayerData
    }
  }