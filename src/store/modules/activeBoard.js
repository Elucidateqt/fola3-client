/**
 * Vuex module for managing data of active boards.
 * Uses SocketIO instead of the API for most communication
 */

import axiosApi from '../../api/axios.js'
import {io} from 'socket.io-client'
let socket = null

/**
 * Creates a new socketIO connection to the server. This is triggered when
 * a user enters a board
 * @param {Object} context - the current vuex context
 * @param {Object} data - data-object containing the access-token that is
 *  required for establishing the connection
 */
const connectSocket = (context, data) => {
  socket = io(`${process.env.VUE_APP_SOCKET_URL}:${process.env.VUE_APP_SOCKET_PORT}`,{
    path: "/socket/",
    withCredentials: true,
    query: {token: data.token}
})
  initializeSocketListeners(context)
}

const disconnectSocket = (context)  => {
  socket.disconnect()
}

const handleErrors = (message) => {
  //assume no response as default case
  let alertConfig = {
    type: "negative",
    message: message,
    visible: true
  }
  store.commit("alert/SET_ALERT_CONFIG", alertConfig, {root: true})
}

const  initializeSocketListeners = (store) => {

    socket.on('exception', (data) => {
      handleErrors(data.message)
    })
    socket.on('message', (data) => {
        let alertConfig = {
            type: "info",
            message: data.message,
            visible: true
          }
          store.commit("alert/SET_ALERT_CONFIG", alertConfig, {root: true})
    })

    socket.on('setBoard', (data) => {
      store.commit("SET_ACTIVE_BOARD", data.board)
    })

    socket.on('playerJoined', (data) => {
      store.dispatch("handlePlayerJoin", data)
    })

    socket.on('playerLeft', (data) => {
      store.commit('SET_PLAYER_OFFLINE', {playerId: data.userId})
    })

    socket.on('cardsCreated', (data) => {
      store.commit("CREATE_CARDS", {"cards": data.newCards, "playerId": data.location.playerId})
    })

    socket.on('interactionPlayed', (data) => {
      store.dispatch('playInteraction', data)
    })

    socket.on('interactionPickedUp', (data) => {
      store.dispatch('pickUpInteraction', data)
    })

    socket.on('cardAttached', (data) => {
      store.dispatch('attachCard', data)
    })

    socket.on('cardDetached', (data) => {
      store.dispatch('detachCard', data)
    })


    socket.on('cardAdded', (data) => {
      switch (data.location.container) {
        case "hand":
          store.commit("ADD_CARD_TO_PLAYER_HAND", {"card": data.card, "playerId": data.location.playerId})
          break;
        case "board":
          store.commit("UPDATE_CARD_ON_BOARD", {"card": data.card, "location": data.location})
          break;
        default:
          break;
      }
    })

    socket.on('cardDeleted', (data) => {
      store.dispatch('deleteCard', data)
    })

    socket.on('cardUpdated', (data) => {
      store.dispatch('updateCard', data)
    })
}

/**
 * socketIO emitters start here
 */

const emitJoinBoard = async ({ state, commit, rootState }, data) => {
  try {
    socket.emit("joinBoard", {userId: rootState.player.uuid, boardId: data.boardId})
  } catch (err) {
    throw new Error(err)
  }
}

const emitLeaveBoard = async ({ state, commit, rootState }) => {
    try {
      socket.emit("leaveBoard", {userId: rootState.player.uuid, boardId: state.uuid})
    } catch (err) {
      throw new Error(err)
    }
  }

const emitMessage = async ({ state, commit }, data) => {
  try {
    socket.emit("message", {"message": data.message})
  } catch (err) {
    throw new Error(err)
  }
}

const emitCreateCard = async({ state, commit, rootState }, data) => {
  try {
    socket.emit('createCard', {userId: rootState.player.uuid, boardId: state.uuid, card: data.card})
  } catch (err) {
    throw new Error(err)
  }
}

const emitPlayInteraction = async ({ state, commit, rootState }, data) => {
  try {
    socket.emit("playInteraction", {
      userId: rootState.player.uuid,
      boardId: state.uuid,
      cardOrigin: data.origin,
      cardId: data.cardId,
      column: data.column,
      index: data.index
  })
  } catch (err) {
    throw new Error(err)
  }
}

const emitPickUpInteraction = async ({ state, commit, rootState }, data) => {
  try {
    socket.emit("pickUpInteraction", {
      userId: rootState.player.uuid,
      boardId: state.uuid,
      cardId: data.cardId,
      column: data.column
  })
  } catch (err) {
    throw new Error(err)
  }
}


const emitAddCard = async ({ state, commit }, data) => {
  try {
    socket.emit("addCard", {card: data.card, location: data.location})
  } catch (err) {
    throw new Error(err)
  }
}

const emitAttachCard = async ({ state, commit, rootState }, data) => {
  try {
    socket.emit("attachCard", {userId: rootState.player.uuid, boardId: state.uuid, cardOrigin: data.cardOrigin, cardId: data.cardId, target: data.target})
  } catch (err) {
    throw new Error(err)
  }
}

const emitDetachCard = async ({ state, commit, rootState }, data) => {
  try {
    socket.emit("detachCard", {userId: rootState.player.uuid, boardId: state.uuid, addonId: data.addonId, hostCardId: data.hostCardId})
  } catch (err) {
    throw new Error(err)
  }
}

const emitUpdateCard = async ({ state, commit, rootState }, data) => {
  try {
    data.config.knowledgebaseUrl = data.config.externalUrl
    socket.emit("updateCard", {userId: rootState.player.uuid, boardId: state.uuid, config: data.config})
  } catch (err) {
    throw new Error(err)
  }
}

const emitDeleteCard = async ({ state, commit, rootState }, data) => {
  try {
    socket.emit("deleteCard", {userId: rootState.player.uuid, boardId: state.uuid, cardId: data.cardId, location: data.location})
  } catch (err) {
    throw new Error(err)
  }
}

const emitImportCurrentDeck = async ({state, commit, rootState}) => {
  try {
    socket.emit("importDeck", {userId: rootState.player.uuid, deckId: rootState.decks.currentDeck.uuid, boardId: state.uuid})
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * Getters and Mutators for the board state start here
 */

const addPlayer = async (state, player) => {
    state.players[player.uuid] = {"uuid": player.uuid, "username": player.username, "isOnline": player.isOnline, "permissions": player.permissions, "roles": player.roles}
    state.playerHands[player.uuid] = player.cards
}

const setPlayerOnline = (state, data) => {
  state.players[data.playerId].isOnline = true
}

const setPlayerOffline = (state, data) => {
  state.players[data.playerId].isOnline = false
}

const getOnlinePlayers = (state) => {
  return Object.values(state.players).filter(player => player.isOnline === true)
}

const removePlayer = async (state, userId) => {
    delete state.playerHands[userId]
    delete state.players[userId]
}

const createCards = (state, data) => {
  data.cards.forEach(card => {
    state.cards[card.uuid] = card
    state.playerHands[data.playerId].push(card.uuid)
  })
}

const updateCard = ({ state, commit }, data) => {
  commit('SET_CARD', {card: data.card})
}

const playInteraction = ({state, commit}, data) => {
  switch (data.cardOrigin.container) {
    case 'hand':
      commit('REMOVE_CARD_FROM_PLAYER_HAND', {playerId: data.cardOrigin.playerId, cardId: data.cardId})
      break;
      default:
        break;
      }
  commit('ADD_CARD_TO_BOARD', {cardId: data.cardId, column: data.column, index: data.index})
}

const pickUpInteraction = ({ state, commit }, data) => {
  const interaction = state.cards[data.cardId]
  let cardList = [interaction.uuid]
  if(interaction.hasOwnProperty('addonsTop')){
    cardList = cardList.concat(interaction.addonsTop)
    delete interaction.addonsTop
  }
  if(interaction.hasOwnProperty('addonsBot')){
    cardList = cardList.concat(interaction.addonsBot)
    delete interaction.addonsBot
  }
  commit('REMOVE_CARD_FROM_BOARD', {cardId: data.cardId, column: data.column})
  cardList.forEach(cardId => {
    commit('ADD_CARD_TO_PLAYER_HAND', {cardId: cardId, playerId: data.userId })
  }) 
}

const addCardToBoard = (state, data) => {
  if(state.boardState[data.column] === undefined){
    state.boardState[data.column] = [data.cardId]
  }else{
    state.boardState[data.column][data.index] = data.cardId
  }
}

const addInteractionToBoard = (state, data) => {
  if(state.boardState[data.column] === undefined) {
    state.boardState[data.column] = []
  }
  state.boardState[data.column][data.index] = data.cardId
}

const removeCardFromBoard = (state, data) => {
  state.boardState[data.column] = state.boardState[data.column].filter(cardId => cardId !== data.cardId)
  //clean up column array, if card was last one
  if(state.boardState[data.column].length === 0) {
    state.boardState.splice(data.column, 1)
  }
}


const addCardToPlayerHand = (state, data) => {
  state.playerHands[data.playerId].push(data.cardId)
}


const removeCardFromPlayerHand = (state, data) => {
  state.playerHands[data.playerId] = state.playerHands[data.playerId].filter(cardId => cardId !== data.cardId)
}

const getCardByUuid = ({state, commit}, data) => {
  if(state.cards.hasOwnProperty(data.cardId)){
    const card = state.cards[data.cardId]
    return card
  }
  return null
}

const getCardAtPosition = ({state, commit}, data) => {
  return state.boardState[data.column][data.index]
}

const detachAddonFromCard = (state, data) => {
  const addon = state.cards[data.addonId]
  const hostCard = state.cards[data.hostCardId]
  switch (addon.cardType) {
    case 'what':
      hostCard.addonsBot = hostCard.addonsBot.filter(cardId => cardId !== addon.uuid)
      break;
    case 'LET':
      hostCard.addonsTop = hostCard.addonsTop.filter(cardId => cardId !== addon.uuid)
      break
  
    default:
      break;
  }
}

const attachAddonToCard = (state, data) => {
  const hostCard = state.cards[data.targetId]
  const addon = state.cards[data.addonId]
  switch (addon.cardType) {
    case 'LET':
      if(!hostCard.hasOwnProperty('addonsTop')){
        hostCard.addonsTop = [addon.uuid]
      }else{
        hostCard.addonsTop.push(addon.uuid)
      }
      break;
    case 'what':
      if(!hostCard.hasOwnProperty('addonsBot')){
        hostCard.addonsBot = [addon.uuid]
      }else{
        hostCard.addonsBot.push(addon.uuid)
      }
      break;
  }
}

const deleteCard = ({state, commit}, data) => {
  const card = state.cards[data.cardId]
  const cardList = []
  if(card.hasOwnProperty('addonsTop')){
    cardList = cardList.concat(card.addonsTop)
  }
  if(card.hasOwnProperty('addonsBot')){
    cardList = cardList.concat(card.addonsBot)
  }
  cardList.forEach(cardId =>{
    commit('ADD_CARD_TO_PLAYER_HAND', {playerId: data.userId, cardId: cardId})
  })

  switch (data.location.container) {
    case "hand":
      commit('REMOVE_CARD_FROM_PLAYER_HAND', {playerId: data.location.playerId, cardId: data.cardId})
      break;
    case "board":
      commit('REMOVE_CARD_FROM_BOARD', {column: data.location.column, cardId: data.cardId})
    default:
      break;
  }

  delete state.cards[data.cardId]
}

const attachCard = ({state, commit}, data) => {
  switch (data.cardOrigin.container) {
    case 'hand':
      commit('REMOVE_CARD_FROM_PLAYER_HAND', {playerId: data.cardOrigin.playerId, cardId: data.cardId})
      break;
    case 'board':
      commit('REMOVE_ADDON_FROM_CARD', {cardId: data.cardId, hostCardId: data.cardOrigin.hostCardId})
      break
    default:
      break;
  }
  commit('ATTACH_ADDON_TO_CARD', {addonId: data.cardId, targetId: data.target})
}

const detachCard = ({state, commit}, data) => {
  commit('DETACH_ADDON_FROM_CARD', {addonId: data.addonId, hostCardId: data.hostCardId})
  commit('ADD_CARD_TO_PLAYER_HAND', {cardId: data.addonId, playerId: data.userId})
}

const joinBoardByInvite = async ({ state, commit }, data) => {
  try {
    const res = await axiosApi.post(`/boards/${data.uuid}/users/me?inv=${data.inviteCode}`)
  } catch (err) {
    throw new Error(err)
  }
}

const handlePlayerJoin = ({state, commit}, data) => {
  if(Object.keys(state.players).some(playerId => playerId === data.user.uuid)){
    commit("SET_PLAYER_ONLINE", {playerId: data.user.uuid})
  }else{
    commit("ADD_PLAYER", data.user)
  }
}

const setActiveBoard = (state, board) => {
    state.uuid = board.uuid
    state.name = board.name
    state.description = board.description
    state.inviteCode = board.inviteCode
    board.cards.forEach(card => {
      state.cards[card.uuid] = card
    })
    state.boardState = board.boardState
    state.players = {}
    state.playerHands = {}
    board.members.forEach(player => {
      state.players[player.uuid] = {"uuid": player.uuid, "username": player.username, "isOnline": player.isOnline, "permissions": player.permissions, "roles": player.roles}
      state.playerHands[player.uuid] = player.cards
    });
}

const setCard = (state, data) => {
  const card = data.card
  state.cards[card.uuid] = card
}

const reset = (state) => {
  state.uuid = null,
  state.name = null,
  state.description = null,
  state.inviteCode =  null,
  state.cards = {},
  state.boardState = [],
  state.players = {},
  state.playerHands = {}
}

const resetBoard = ({state, commit}) => {
    commit("RESET")
}

export default {
    namespaced: true,
    
    state: {
        uuid: null,
        name: null,
        description: null,
        inviteCode: null,
        cards: {},
        boardState: [],
        players: {},
        playerHands: {},
    },
    mutations: {
      SET_ACTIVE_BOARD: setActiveBoard,
      SET_CARD: setCard,
      ADD_PLAYER: addPlayer,
      REMOVE_PLAYER: removePlayer,
      SET_PLAYER_ONLINE: setPlayerOnline,
      SET_PLAYER_OFFLINE: setPlayerOffline,
      CREATE_CARDS: createCards,
      PLAY_INTERACTION: playInteraction,
      ADD_CARD_TO_BOARD: addCardToBoard,
      ADD_INTERACTION_TO_BOARD: addInteractionToBoard,
      ATTACH_ADDON_TO_CARD: attachAddonToCard,
      DETACH_ADDON_FROM_CARD: detachAddonFromCard,
      REMOVE_CARD_FROM_BOARD: removeCardFromBoard,
      ADD_CARD_TO_PLAYER_HAND: addCardToPlayerHand,
      REMOVE_CARD_FROM_PLAYER_HAND: removeCardFromPlayerHand,
      RESET: reset
    },
    getters: {
      onlinePlayers: getOnlinePlayers
    },
    actions: {
        connectSocket,
        disconnectSocket,
        joinBoardByInvite,
        handlePlayerJoin,
        emitMessage,
        emitPlayInteraction,
        emitPickUpInteraction,
        emitCreateCard,
        emitAddCard,
        emitAttachCard,
        emitDetachCard,
        emitUpdateCard,
        emitDeleteCard,
        emitImportCurrentDeck,
        emitJoinBoard,
        emitLeaveBoard,
        playInteraction,
        pickUpInteraction,
        deleteCard,
        updateCard,
        attachCard,
        detachCard,
        getCardAtPosition,
        getCardByUuid,
        resetBoard
    }
  }