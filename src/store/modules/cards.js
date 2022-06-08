/**
 * Vuex module to handle data related to cards
 */

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

const loadCardByUuid = async ({ state, commit }, data) => {
  try {
      let res = await axiosApi.get(`/cards/${data.cardId}`)
      commit('ADD_CARDS', [res.data.card])
  } catch(err) {
      throw new Error(err)
  }
}

const createCard = async ({ state, commit }, data) => {
    try {
        const res = await axiosApi.post(`/cards/`, {
          "name": data.card.name,
          "description": data.card.description,
          "externalLink": data.card.externalLink,
          "imageUrl": data.card.imageUrl,
          "cardType": data.card.cardType,
          "interactionSubjectLeft": data.card.interactionSubjectLeft,
          "interactionSubjectRight": data.card.interactionSubjectRight,
          "interactionDirection": data.card.interactionDirection

        })
        commit('ADD_CARDS', [res.data.card])
    } catch (err) {
        throw new Error(err)
    }
}

const deleteCard = async ({ state, commit, rootState }, data) => {
  try {
      const res = await axiosApi.delete(`/cards/${data.uuid}`)
      rootState.decks.ownDecks.forEach(deck => {
        deck.cards = deck.cards.filter(cardId => cardId !== data.uuid)
      })
      if(rootState.decks.currentDeck){
        rootState.decks.currentDeck.cards = rootState.decks.currentDeck.cards.filter(uuid => uuid !== data.uuid)
      }
      commit("REMOVE_CARDS", [data.uuid])
      
  } catch (err) {
      throw new Error(err)
  }
}

const updateCard = async ({ state, commit }, data) => {
  try {
      const res = await axiosApi.put(`/cards/${data.uuid}`, data)
      state.cards[res.data.card.uuid] = res.data.card

  } catch (err) {
      throw new Error(err)
  }
}

const addCards = (state, cards) => {
  cards.forEach(card => state.cards[card.uuid] = card)
}

const removeCards = (state, cardIds) => {
  cardIds.forEach(uuid => delete state.cards[uuid])
}

const increaseOffset = (state) => {
  state.offset += state.limit
}

const loadingFinished = (state) => {
  state.hasMore = false
}

const resetPagination = (state) => {
  state.hasMore = true
  state.offset = 0
}

const resetCards = ({state, commit, rootState}, options) => {
  const keepDeckCards = (options && options.keepDeckCards) || false
  if(keepDeckCards === true){
    let cardIds = Object.keys(state.cards)
    rootState.decks.ownDecks.forEach(deck => {
      cardIds = cardIds.filter(id => !deck.cards.includes(id))
    })
    commit('REMOVE_CARDS', cardIds)
    commit('RESET_PAGINATION')
  }else{
    commit('RESET')
  }
}

const reset = (state) => {

  state.cards = {}
  state.offset = 0
  state.hasMore = true
}

export default {
    namespaced: true,
    
    state: {
      hasMore: true,
      limit: 5,
      offset: 0,
      cards: {},
    },
    mutations: {
      ADD_CARDS: addCards,
      REMOVE_CARDS: removeCards,
      INCREASE_OFFSET: increaseOffset,
      LOADING_FINISHED: loadingFinished,
      RESET_PAGINATION: resetPagination,
      RESET: reset
    },
    getters: {

    },
    actions: {
        createCard,
        loadCards,
        loadCardByUuid,
        updateCard,
        deleteCard,
        resetCards: resetCards
    }
  }