import axiosApi from '../../api/axios.js'

const loadOwnCardSets = async ({ state, commit, rootState }) => {
  console.log("profileId", rootState.player.uuid)
  try {
    const res = await axiosApi.get(`/cardsets/my`)
    commit('ADD_CARDSETS', res.data.cardsets)
  } catch(err) {
      throw new Error(err)
  }
}

const loadPublicCardSets = async ({ state, commit }) => {
  try {
    const res = await axiosApi.get(`/cardsets?owner=public&public=true`)
    commit('ADD_CARDSETS', res.data.cardsets)
  } catch(err) {
      throw new Error(err)
  }
}

const loadWIPCardSets = async ({ state, commit }) => {
  try {
    const res = await axiosApi.get(`/cardsets?owner=public&public=false`)
    commit('ADD_CARDSETS', res.data.cardsets)
  } catch(err) {
      throw new Error(err)
  }
}

const addCardsets = (state, sets) => {
  state.cardsets = state.cardsets.concat(sets)
}

const setOwnSets = (state, sets) => {
  state.ownSets = sets
}

const setPublicSets = (state, sets) => {
  state.publicSets = sets
}

const setWIPSets = (state, sets) => {
  state.wipSets = sets
}

const getCheckboxOptions = (state) => {
  const options = []
  state.cardsets.forEach(set => options.push({
    "label": set.name,
    "value": set.uuid,
    "checked-icon": set.iconUrl === null ? "style" : `img:${set.iconUrl}`
  }))
  return options
}

const getBearerSets = (state, commit, rootState) => {
  return state.cardsets.filter(set => set.owner === rootState.player.uuid)
}

const reset = (state) => {
  state.cardsets = []
}

const resetCardSets = ({ state, commit }) => {
  commit('RESET')
}



export default {
    namespaced: true,
    
    state: {
      cardsets: [],
    },
    mutations: {
      RESET: reset,
      ADD_CARDSETS: addCardsets,
      SET_OWN_SETS: setOwnSets,
      SET_PUBLIC_SETS: setPublicSets,
      SET_WIP_SETS: setWIPSets,
    },
    getters: {
      getCheckboxOptions,
      getBearerSets,
    },
    actions: {
        loadOwnCardSets,
        loadPublicCardSets,
        loadWIPCardSets,
        resetCardSets
    }
  }