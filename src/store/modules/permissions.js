import axiosApi from '../../api/axios.js'

const loadUserPermissions = async ({ state, commit }) => {
    try {
        const res = await axiosApi.get(`/permissions/my`)
        commit('SET_USER_PERMISSIONS', res.data.permissions)
    } catch (err) {
        console.error('could not load permissions', err)
    }
}

const setUserPermissions = (state, permissions) => {
    state.permissions = permissions
}

const userHasPermission = ( state , permission) => {
    return state.permissions && state.permissions.includes(permission)
}

const reset = (state) => {
    state.permissions = null
}

export default {
    namespaced: true,
    
    state: {
        permissions: null
    },
    mutations: {
      RESET: reset,
      SET_USER_PERMISSIONS: setUserPermissions
    },
    getters: {
        userHasPermission
    },
    actions: {
        loadUserPermissions
    }
  }