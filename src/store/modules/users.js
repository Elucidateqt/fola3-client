import axiosApi from '../../api/axios.js'

const loadUsers = async ({ state, commit }) => {
  try {
    if(state.hasMore) {
      let offset = state.offset
      commit('INCREASE_OFFSET')
      let res = await axiosApi.get(`/users/`)
      state.users = res.data.userList
      /*if (res.data.userList.length == 0) {
          commit('LOADING_FINISHED')
          return
      }
      commit('ADD_USERS', res.data.userList)*/
    }
  } catch(e) {
      console.error("could not load users",e)
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
        loadUsers
    }
  }