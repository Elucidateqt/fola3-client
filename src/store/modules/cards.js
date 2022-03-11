import axiosApi from '../../api/axios.js'

const loadAllAvailableCards = async ({ state, commit }) => {
  try {
    if(state.hasMore) {
      let offset = state.offset
      commit('INCREASE_OFFSET')
      let res = await axiosApi.get(`/cards/my?limit=${state.limit}&offset=${offset}`)
      if (res.data.cardlist.length == 0) {
          commit('LOADING_FINISHED')
          return
      }
      commit('ADD_CARDS', res.data.cardlist)
    }
  } catch(err) {
      throw new Error(err)
  }
}

const loadCardDetails = async ({ state, commit }, uuid) => {
  try {
    const res = await axiosApi.get(`/cards/${uuid}`)
    commit('SET_CARD_DETAILS', {board: res.data.card})
  } catch (err) {
    throw new Error(err)
  }
}

const setCardDetails = (state, data) => {
  state.cardDetails = data.card
}

const createCard = async ({ state, commit }, data) => {
    try {
        const res = await axiosApi.post(`/cards/`, {
            "name": data.name,
            "description": data.description
        })
        if(res && res.data && res.data.card){
          commit('ADD_CARDS', [res.data.card])
        }
    } catch (err) {
        throw new Error(err)
    }
}

const addCards = (state, data) => {
  state.cards = state.cards.concat(data)
}

const increaseOffset = (state) => {
  state.offset += state.limit
}

const loadingFinished = (state) => {
  state.hasMore = false
}

const reset = (state) => {
  state.cards = []
  state.offset = 0
  state.hasMore = true
  state.boardDetails = null
}

export default {
    namespaced: true,
    
    state: {
      hasMore: true,
      limit: 5,
      offset: 0,
      cards: [],
      cardDetails: null,
    },
    mutations: {
      ADD_CARDS: addCards,
      INCREASE_OFFSET: increaseOffset,
      LOADING_FINISHED: loadingFinished,
      SET_CARD_DETAILS: setCardDetails,
      RESET: reset
    },
    getters: {

    },
    actions: {
        loadAllAvailableCards: createCard,
        loadAllAvailableCards: loadAllAvailableCards,
        loadCardDetails: loadCardDetails,
    }
  }