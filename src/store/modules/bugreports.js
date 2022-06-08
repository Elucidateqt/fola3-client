/**
 * vuex module to handle data related to bugreports
 */

import axiosApi from '../../api/axios.js'

const submitBugReport = async ({ state, commit }, data) => {
    try {
        const res = await axiosApi.post(`/bugreports/`, {
            "route": data.route,
            "summary": data.summary,
            "description": data.description
        })
    } catch (err) {
        throw new Error(err)
    }
}

const loadBugReports = async ({ state, commit }) => {
    try {
      if(state.hasMore) {
        let res = await axiosApi.get(`/bugreports/`)
        state.users = res.data.userList
      }
    } catch(e) {
        console.error("could not load bugreports",e)
    }
  }

  const addBugreports = (state, data) => {
    state.bugreports = state.bugreports.concat(data)
  }
  
  const increaseOffset = (state) => {
    state.offset += state.batchSize
  }
  
  const loadingFinished = (state) => {
    state.hasMore = false
  }
  

const reset = (state) => {
    state.bugreports = []
    state.offset = 0
    state.hasMore = true
}

const resetBugReports = ({state, commit}) => {
    commit('RESET')
}

export default {
    namespaced: true,
    
    state: {
        bugreports: null,
        offset: 0,
        hasMore: true
    },
    mutations: {
      RESET: reset,
      ADD_BUGREPORTS: addBugreports,
      INCREASE_OFFSET: increaseOffset,
      LOADING_FINISHED: loadingFinished
    },
    getters: {

    },
    actions: {
        submitBugReport,
        resetBugReports,
        loadBugReports
    }
  }