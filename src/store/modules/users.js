/**
 * vuex module that handles data related to users in FoLA3
 */

import axiosApi from '../../api/axios.js'

const loadUsers = async ({ state, commit }) => {
  try {
    if(state.hasMore) {
      let offset = state.offset
      commit('INCREASE_OFFSET')
      let res = await axiosApi.get(`/users/`)
      state.users = res.data.userList
    }
  } catch(err) {
      throw new Error(err)
  }
}

const updateUserPassword = async (state, data) => {
  try {
    await axiosApi.put(`/users/${data.uuid}/password`, {password: data.password})
  } catch (err) {
    throw new Error(err)
  }
}

const addUsers = (state, data) => {
  state.users = state.users.concat(data)
}

const increaseOffset = (state) => {
  state.offset += state.batchSize
}

const loadingFinished = (state) => {
  state.hasMore = false
}

const reset = (state) => {
  state.users = []
  state.offset = 0
  state.hasMore = true
}

export default {
    namespaced: true,
    
    state: {
      hasMore: true,
      batchSize: 15,
      offset: 0,
      users: []
    },
    mutations: {
      ADD_USERS: addUsers,
      INCREASE_OFFSET: increaseOffset,
      LOADING_FINISHED: loadingFinished,
      RESET: reset
    },
    getters: {

    },
    actions: {
        loadUsers,
        updateUserPassword
    }
  }