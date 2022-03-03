import axiosApi from '../../api/axios.js'

const loadOwnProjects = async ({ state, commit }) => {
  try {
    if(state.hasMore) {
      let offset = state.offset
      commit('INCREASE_OFFSET')
      let res = await axiosApi.get(`/projects/my?limit=${state.limit}&offset=${offset}`)
      if (res.data.projectList.length == 0) {
          commit('LOADING_FINISHED')
          return
      }
      commit('ADD_PROJECTS', res.data.projectList)
    }
  } catch(err) {
      throw new Error(err)
  }
}

const joinProjectByInvite = async ({ state, commit }, data) => {
  try {
    const res = await axiosApi.post(`/projects/${data.uuid}/users/me?code=${data.inviteCode}`)
  } catch (err) {
    throw new Error(err)
  }
}

const loadProjectDetails = async ({ state, commit }, uuid) => {
  try {
    const res = await axiosApi.get(`/projects/${uuid}`)
    commit('SET_PROJECT_DETAILS', {project: res.data.project})
  } catch (err) {
    throw new Error(err)
  }
}

const setProjectDetails = (state, data) => {
  state.projectDetails = data.project
}

const createProject = async ({ state, commit }, data) => {
    try {
        const res = await axiosApi.post(`/projects/`, {
            "name": data.name,
            "description": data.description
        })
        if(res && res.data && res.data.project){
          commit('ADD_PROJECTS', [res.data.project])
        }
    } catch (err) {
        throw new Error(err)
    }
}

const addProjects = (state, data) => {
  state.projects = state.projects.concat(data)
}

const increaseOffset = (state) => {
  state.offset += state.limit
}

const loadingFinished = (state) => {
  state.hasMore = false
}

const reset = (state) => {
  state.projects = []
  state.offset = 0
  state.hasMore = true
  state.projectDetails = null
}

export default {
    namespaced: true,
    
    state: {
      hasMore: true,
      limit: 5,
      offset: 0,
      projects: [],
      projectDetails: null,
    },
    mutations: {
      ADD_PROJECTS: addProjects,
      INCREASE_OFFSET: increaseOffset,
      LOADING_FINISHED: loadingFinished,
      SET_PROJECT_DETAILS: setProjectDetails,
      RESET: reset
    },
    getters: {

    },
    actions: {
        createProject,
        loadOwnProjects,
        loadProjectDetails,
        joinProjectByInvite
    }
  }