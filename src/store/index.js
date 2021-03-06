/**
 * Vuex root module.
 * Creates the axios plugin and imports all sub-modules.
 */

import { createStore } from "vuex";
import users from './modules/users'
import profile from './modules/profile'
import player from './modules/player'
import auth from './modules/auth'
import permissions from './modules/permissions'
import bugreports from "./modules/bugreports"
import boards from './modules/boards'
import activeBoard from "./modules/activeBoard";
import cardsets from './modules/cardsets'
import cards from './modules/cards'
import decks from './modules/decks'
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
    boards,
    activeBoard,
    cardsets,
    cards,
    decks,
    alert
  },
  plugins: [axiosPlugin]
});