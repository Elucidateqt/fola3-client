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

const getPublicSets = (state) => {
  return state.cardsets.filter(set => set.owner === 'public')
}

const createCardset = async ({ state, commit }, data) => {
  try {
    const res = await axiosApi.post(`/cardsets`, data.set)
    state.cardsets.unshift(res.data.cardset)
  } catch(err) {
      throw new Error(err)
  }
}

const updateCardset = async ({ state, commit }, data) => {
  try {
    const res = await axiosApi.post(`/cardsets/${data.set.uuid}`, data.set)
    const index = state.cardsets.map(set => set.uuid).indexOf(res.data.cardset.uuid)
    state.cardsets[index] = res.data.cardset
  } catch(err) {
      throw new Error(err)
  }
}

const deleteCardset = async ({ state, commit }, data) => {
  try {
    const res = await axiosApi.delete(`/cardsets/${data.set.uuid}`)
    state.cardsets = state.cardsets.filter(set => set.uuid !== data.set.uuid)
  } catch(err) {
      throw new Error(err)
  }
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
    },
    getters: {
      getCheckboxOptions,
      getBearerSets,
      getPublicSets
    },
    actions: {
        loadOwnCardSets,
        loadPublicCardSets,
        loadWIPCardSets,
        createCardset,
        updateCardset,
        deleteCardset,
        resetCardSets
    }
  }