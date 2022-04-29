import axiosApi from '../../api/axios.js'

const loadOwnDecks = async ({ state, commit }) => {
  try {
    const res = await axiosApi.get(`/decks/my`)
    res.data.decks.forEach(deck => {
      commit('cards/ADD_CARDS', deck.cards, {root: true})
      deck.cards = deck.cards.map(card => card.uuid)
    })
    commit('SET_OWN_DECKS', res.data.decks)
  } catch(err) {
      throw new Error(err)
  }
}

const loadPublicDecks = async ({ state, commit }) => {
  try {
    const res = await axiosApi.get(`/decks?owner=public&public=true`)
    commit('SET_PUBLIC_DECKS', res.data.decks)
  } catch(err) {
      throw new Error(err)
  }
}

const loadWIPDecks = async ({ state, commit }) => {
  try {
    const res = await axiosApi.get(`/decks?owner=public&public=false`)
    commit('SET_WIP_SETS', res.data.decks)
  } catch(err) {
      throw new Error(err)
  }
}

const createOwnDeck = async ({ state, commit }, data) => {
  try {
    const res = await axiosApi.post(`/decks/my`, {
      "name": data.name,
      "cards": data.cards,
      "public": data.public
    })
    commit('ADD_OWN_DECKS', [res.data.deck])
  } catch (err) {
    throw new Error(err)
  }
}

const setDeck = (state, data) => {
  state.ownDecks[data.index] = data.deck
}

const setOwnDecks = (state, decks) => {
  state.ownDecks = decks
}

const addOwnDecks = (state, decks) => {
  state.ownDecks = decks.concat(state.ownDecks)
}

const setPublicDecks = (state, decks) => {
  state.publicDecks = decks
}

const setWIPDecks = (state, decks) => {
  state.wipDecks = decks
}

const setCurrentDeck = async ({state, commit, rootState, dispatch}, index) => {
  const selectedDeck = state.ownDecks[index]
  state.currentDeck = Object.assign({}, selectedDeck)
}

const resetCurrentDeck = ({state, commit}) => {
  state.currentDeck = null
}

const getAllDecks = (state) => {
  return state.ownDecks.concat(state.publicDecks).concat(state.wipDecks)
}

const addCardToCurrentDeck = ({state, commit}, cardId) => {
  state.currentDeck.cards.push(cardId)
}

const removeCardFromCurrentDeck = ({state, commit}, uuid) => {
  state.currentDeck.cards = state.currentDeck.cards.filter(cardId => cardId !== uuid)
}

const setCurrentDeckName = ({state, commit}, name) => {
  state.currentDeck.name = name
}

const isCardInCurrentDeck = (state) => (uuid) => {
  if(state.currentDeck === null){
    return false
  }
  let isCardInDeck = state.currentDeck.cards.includes(uuid)
  return isCardInDeck
}

const isSelectedDeck = (state) => (uuid) => {
  if(state.currentDeck === null){
    return false
  }
  return state.currentDeck.uuid === uuid
}

const saveCurrentDeck = async ({state, commit}) => {
  try {
    const res = await axiosApi.put(`/decks/${state.currentDeck.uuid}`, {
      "name": state.currentDeck.name,
      "owner": state.currentDeck.owner,
      "cards": state.currentDeck.cards
    })
    const index = state.ownDecks.map(deck => deck.uuid).indexOf(state.currentDeck.uuid)
    commit('SET_DECK', {'index': index, 'deck': state.currentDeck})
    state.currentDeck = null
  } catch(err) {
      throw new Error(err)
  }
}

const deleteCurrentDeck = async({ state, commit }) => {
  try {
    const res = await axiosApi.delete(`/decks/${state.currentDeck.uuid}`)
    const index = state.ownDecks.map(deck => deck.uuid).indexOf(state.currentDeck.uuid)
    state.ownDecks.splice(index, 1)
    state.currentDeck = null
  } catch (err) {
    throw new Error(err)
  }
}

const reset = (state) => {
  state.ownDecks = []
  state.publicDecks = []
  state.wipDecks = []
  state.currentDeck = null
}

const resetDecks = ({state, commit}) => {
  commit("RESET")
}



export default {
    namespaced: true,
    
    state: {
      ownDecks: [],
      publicDecks: [],
      wipDecks: [],
      currentDeck: null
    },
    mutations: {
      RESET: reset,
      SET_OWN_DECKS: setOwnDecks,
      SET_DECK: setDeck,
      ADD_OWN_DECKS: addOwnDecks,
      SET_PUBLIC_DECKS: setPublicDecks,
      SET_WIP_DECKS: setWIPDecks,
    },
    getters: {
      getAllDecks,
      isCardInCurrentDeck,
      isSelectedDeck,
    },
    actions: {
        createOwnDeck,
        loadOwnDecks,
        loadPublicDecks,
        loadWIPDecks,
        setCurrentDeck,
        setCurrentDeckName,
        addCardToCurrentDeck,
        removeCardFromCurrentDeck,
        saveCurrentDeck,
        deleteCurrentDeck,
        resetCurrentDeck,
        resetDecks
    }
  }