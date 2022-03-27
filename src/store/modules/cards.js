import axiosApi from '../../api/axios.js'

const loadCards = async ({ state, commit }, data) => {
  try {
    if(state.hasMore) {
      let offset = state.offset
      commit('INCREASE_OFFSET')
      let setString = `?sets=`
      data.setIds.forEach(setId => setString +=`${setId},`)
      //remove last ","
      setString = setString.slice(0, setString.length - 1)
      let res = await axiosApi.get(`/cards${setString}&limit=${state.limit}&offset=${offset}`)
      if (res.data.cards.length == 0) {
          commit('LOADING_FINISHED')
          return
      }
      commit('ADD_CARDS', res.data.cards)
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
          "name": data.card.name,
          "description": data.card.description,
          "knowledbaseUrl": data.card.knowledbaseUrl,
          "imageUrl": data.card.imageUrl,
          "type": data.card.type,
          "interactionSubjectLeft": data.card.interactionSubjectLeft,
          "interactionSubjectRight": data.card.interactionSubjectRight,
          "interactionDirection": data.card.interactionDirection

        })
    } catch (err) {
        throw new Error(err)
    }
}

const deleteCard = async ({ state, commit }, data) => {
  try {
      const res = await axiosApi.delete(`/cards/${data.uuid}`)
      commit("REMOVE_CARDS", [data.uuid])
  } catch (err) {
      throw new Error(err)
  }
}

const updateCard = async ({ state, commit }, data) => {
  try {
      const res = await axiosApi.put(`/cards/${data.uuid}`, data)
      const cardIndex = state.cards.map(card => card.uuid).indexOf(data.uuid)
      state.cards[cardIndex] = res.data.card

  } catch (err) {
      throw new Error(err)
  }
}

const addCards = (state, data) => {
  state.cards = state.cards.concat(data)
}

const removeCards = (state, data) => {
  state.cards = state.cards.filter(card => !data.includes(card.uuid))
}

const increaseOffset = (state) => {
  state.offset += state.limit
}

const loadingFinished = (state) => {
  state.hasMore = false
}

const resetCards = ({state, commit}) => {
  commit('RESET')
}

const reset = (state) => {
  state.cards = []
  state.offset = 0
  state.hasMore = true
  state.cardDetails = null
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
      REMOVE_CARDS: removeCards,
      INCREASE_OFFSET: increaseOffset,
      LOADING_FINISHED: loadingFinished,
      SET_CARD_DETAILS: setCardDetails,
      RESET: reset
    },
    getters: {

    },
    actions: {
        createCard,
        loadCards,
        updateCard,
        deleteCard,
        loadCardDetails: loadCardDetails,
        resetCards: resetCards
    }
  }