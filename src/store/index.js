import { createStore } from "vuex";
import users from './modules/users'
import profile from './modules/profile'
import player from './modules/player'
import auth from './modules/auth'
import permissions from './modules/permissions'
import bugreports from "./modules/bugreports"
import projects from './modules/projects'
import alert from './modules/alert'
import axiosApi, {axiosAuth} from '../api/axios.js'
import createAxiosPlugin from '../api'

const axiosPlugin = createAxiosPlugin()

const checkApiHealth = async ({ commit }) => {
  try {
    await axiosApi.get(`/health`);
    commit('SET_API_STATUS', true)
  } catch(e) {
      commit('SET_API_STATUS', false)
  }
}

const setApiStatus = (state, data) => {
  state.apiOnline = data
}



export default createStore({
  state: {
    apiOnline: false
  },
  mutations: {
    SET_API_STATUS: setApiStatus
  },
  actions: { checkApiHealth },
  modules: {
    auth,
    users,
    profile,
    player,
    permissions,
    bugreports,
    projects,
    alert
  },
  plugins: [axiosPlugin]
});