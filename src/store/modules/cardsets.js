import axiosApi from '../../api/axios.js'

const loadOwnCardSets = async ({ state, commit }) => {
  try {
    const res = await axiosApi.get(`/cardsets/my`)
    commit('SET_OWN_SETS', res.data.cardsets)
  } catch(err) {
      throw new Error(err)
  }
}

const loadPublicCardSets = async ({ state, commit }) => {
  try {
    const res = await axiosApi.get(`/cardsets?owner=public&public=true`)
    commit('SET_PUBLIC_SETS', res.data.cardsets)
  } catch(err) {
      throw new Error(err)
  }
}

const loadWIPCardSets = async ({ state, commit }) => {
  try {
    const res = await axiosApi.get(`/cardsets?owner=public&public=false`)
    commit('SET_WIP_SETS', res.data.cardsets)
  } catch(err) {
      throw new Error(err)
  }
}

const setOwnSets = (state, sets) => {
  state.ownSets = state.ownSets.concat(sets)
}

const setPublicSets = (state, sets) => {
  state.publicSets = state.publicSets.concat(sets)
}

const setWIPSets = (state, sets) => {
  state.wipSets = state.wipSets.concat(sets)
}

const getCheckboxOptions = (state) => {
  const options = []
  state.ownSets.forEach(set => options.push({
    "label": set.name,
    "value": set.uuid,
    "checked-icon": set.iconUrl === null ? "style" : `img:${set.iconUrl}`
  }))
  state.publicSets.forEach(set => options.push({
    "label": set.name,
    "value": set.uuid,
    "checked-icon": set.iconUrl === null ? "style" : set.iconUrl
  }))
  state.wipSets.forEach(set => options.push({
    "label": set.name,
    "value": set.uuid,
    "checked-icon": set.iconUrl === null ? "style" : set.iconUrl
  }))
  return options
}

const reset = (state) => {
  state.ownSets = []
  state.publicSets = []
  state.wipSets = []
}



export default {
    namespaced: true,
    
    state: {
      ownSets: [],
      publicSets: [],
      wipSets: [],
    },
    mutations: {
      RESET: reset,
      SET_OWN_SETS: setOwnSets,
      SET_PUBLIC_SETS: setPublicSets,
      SET_WIP_SETS: setWIPSets,
    },
    getters: {
      getCheckboxOptions
    },
    actions: {
        loadOwnCardSets,
        loadPublicCardSets,
        loadWIPCardSets

    }
  }