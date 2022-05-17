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
    if(res.data.user.roles){
      commit('SET_ROLES', res.data.user.roles)
    }
    if(res.data.user.revokedPermissions){
      commit('SET_REVOKED_PERMISSIONS', res.data.user.revokedPermissions)
    }
  } catch(err) {
      throw new Error(err)
  }
}

const updateProfileRoles = async ({ state, commit }, data) => {
  try {
    const res = await axiosApi.put(`/users/${data.userId}/roles`, {"roles": data.roleIds})
    commit('SET_ROLES', res.data.roles)
  } catch (err) {
    throw new Error(err)
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

const setRoles = (state, roles) => {
  state.roles = roles
}

const setRevokedPermissions = (state, permissions) => {
  state.revokedPermissions = permissions
}

const resetProfile = ({state, commit}) => {
  commit('RESET')
}

const reset = (state) => {
  state.username = null
  state.uuid = null
  state.email = null
  state.createdAt = null
  state.revokedPermissions = null
  state.roles = null
}



export default {
    namespaced: true,
    
    state: {
      username: null,
      uuid: null,
      email: null,
      createdAt: null,
      roles: null,
      revokedPermissions: null,
    },
    mutations: {
      RESET: reset,
      SET_USERNAME: setUsername,
      SET_UUID: setUuid,
      SET_EMAIL: setEmail,
      SET_CREATED_AT: setCreationDate,
      SET_ROLES: setRoles,
      SET_REVOKED_PERMISSIONS: setRevokedPermissions
    },
    getters: {

    },
    actions: {
        loadProfile,
        resetProfile,
        updateProfileRoles
    }
  }