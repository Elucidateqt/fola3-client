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
    commit('SET_BOARD_DETAILS', {board: res.data.board})
  } catch (err) {
    throw new Error(err)
  }
}

const setBoardDetails = (state, data) => {
  state.boardDetails = data.board
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
  state.boardDetails = null
}

export default {
    namespaced: true,
    
    state: {
      hasMore: true,
      limit: 5,
      offset: 0,
      boards: [],
      boardDetails: null,
    },
    mutations: {
      ADD_BOARDS: addBoards,
      INCREASE_OFFSET: increaseOffset,
      LOADING_FINISHED: loadingFinished,
      SET_BOARD_DETAILS: setBoardDetails,
      RESET: reset
    },
    getters: {

    },
    actions: {
        createBoard,
        loadOwnBoards,
        loadBoardDetails,
        joinBoardByInvite,
        emitMessage
    }
  }