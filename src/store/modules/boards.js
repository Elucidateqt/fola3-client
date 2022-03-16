import axiosApi from '../../api/axios.js'
import socket from '../../socket/socketio.js'

const loadOwnBoards = async ({ state, commit }) => {
  try {
    if(state.hasMore) {
      let offset = state.offset
      commit('INCREASE_OFFSET')
      let res = await axiosApi.get(`/boards/my?limit=${state.limit}&offset=${offset}`)
      if (res.data.boardList.length == 0) {
          commit('LOADING_FINISHED')
          return
      }
      commit('ADD_BOARDS', res.data.boardList)
    }
  } catch(err) {
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

const emitPlayInteraction = async ({ state, commit }, card) => {
  try {
    socket.emit("playInteraction", {"card": card})
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

const emitUpdateCard = async ({ state, commit }, data) => {
  console.log("emitting update card", data)
  try {
    socket.emit("updateCard", {card: data.card, location: data.location})
  } catch (err) {
    throw new Error(err)
  }
}

const emitRemoveCard = async ({ state, commit }, data) => {
  try {
    socket.emit("removeCard", {cardId: data.cardId, location: data.location})
  } catch (err) {
    throw new Error(err)
  }
}

const addInteractionToActiveBoard = (state, card) => {
  state.activeBoardState.push([card])
}

const removeCardFromBoard = (state, data) => {
  console.log("removing card from board", data)
  state.activeBoardState[data.column].splice(data.index, 1)
  if(state.activeBoardState[data.column].length === 0){
    state.activeBoardState.splice(data.column, 1)
  }
}


const addCardToPlayerHand = (state, data) => {
  state.activeBoardHands[data.playerId].push(data.card)
}


const removeCardFromPlayerHand = (state, data) => {
  const index = state.activeBoardHands[data.playerId].map(card => card.uuid).indexOf(data.cardId)
  state.activeBoardHands[data.playerId].splice(index, 1)
}


const updateCardInPlayerHand = (state, data) => {
  console.log("updating card in hand", data)
  state.activeBoardHands[data.playerId][data.index] = data.card
}

const updateCardOnBoard = (state, data) => {
  console.log("updating card on board", data)
  state.activeBoardState[data.column][data.index] = data.card
}

const getActiveBoardPlayers = (state) => {
  if(state.activeBoard && state.activeBoard.members){
    return state.activeBoard.members
  }
  return []
}

const joinBoardByInvite = async ({ state, commit }, data) => {
  try {
    const res = await axiosApi.post(`/boards/${data.uuid}/users/me?inv=${data.inviteCode}`)
  } catch (err) {
    throw new Error(err)
  }
}

const loadBoardDetails = async ({ state, commit }, uuid) => {
  try {
    const res = await axiosApi.get(`/boards/${uuid}`)
    commit('SET_ACTIVE_BOARD', {board: res.data.board})
  } catch (err) {
    throw new Error(err)
  }
}

const setactiveBoard = (state, data) => {
  state.activeBoard = data.board
  data.board.members.forEach(member => {
    state.activeBoardPlayers[member.uuid] = {"uuid": member.uuid, "username": member.username}
    state.activeBoardHands[member.uuid] = member.cards
  });
}

const createBoard = async ({ state, commit }, data) => {
    try {
        const res = await axiosApi.post(`/boards/`, {
            "name": data.name,
            "description": data.description
        })
        if(res && res.data && res.data.board){
          commit('ADD_BOARDS', [res.data.board])
        }
    } catch (err) {
        throw new Error(err)
    }
}

const addBoards = (state, data) => {
  state.boards = state.boards.concat(data)
}

const increaseOffset = (state) => {
  state.offset += state.limit
}

const loadingFinished = (state) => {
  state.hasMore = false
}

const reset = (state) => {
  state.boards = []
  state.offset = 0
  state.hasMore = true
  state.activeBoard = null
}

export default {
    namespaced: true,
    
    state: {
      hasMore: true,
      limit: 5,
      offset: 0,
      boards: [],
      activeBoard: {},
      activeBoardState: [],
      activeAddonCards: {},
      activeBoardPlayers: {},
      activeBoardHands: {},
    },
    mutations: {
      ADD_BOARDS: addBoards,
      INCREASE_OFFSET: increaseOffset,
      LOADING_FINISHED: loadingFinished,
      SET_ACTIVE_BOARD: setactiveBoard,
      ADD_INTERACTION_TO_ACTIVE_BOARD: addInteractionToActiveBoard,
      REMOVE_CARD_FROM_BOARD: removeCardFromBoard,
      ADD_CARD_TO_PLAYER_HAND: addCardToPlayerHand,
      REMOVE_CARD_FROM_PLAYER_HAND: removeCardFromPlayerHand,
      UPDATE_CARD_IN_PLAYER_HAND: updateCardInPlayerHand,
      UPDATE_CARD_ON_BOARD: updateCardOnBoard,
      RESET: reset
    },
    getters: {
      activeBoardMembers : getActiveBoardPlayers
    },
    actions: {
        createBoard,
        loadOwnBoards,
        loadBoardDetails,
        joinBoardByInvite,
        emitMessage,
        emitPlayInteraction,
        emitAddCard,
        emitUpdateCard,
        emitRemoveCard
    }
  }