import axiosApi from '../../api/axios.js'

const loadAllPermissions = async ({state, commit}) => {
    try {
        const res = await axiosApi.get(`/permissions/`)
        commit('SET_USER_PERMISSIONS', res.data.permissions)
    } catch (err) {
        throw new Error(err)
    }
}

const reset = (state) => {
    state.permissions = null
}

const resetPermissions = ({state, commit}) => {
    commit('RESET')
}

export default {
    namespaced: true,
    
    state: {
        permissions: null
    },
    mutations: {
      RESET: reset,
    },
    getters: {
    },
    actions: {
        resetPermissions,
        loadAllPermissions
    }
  }