import axiosApi from '../../api/axios.js'

const loadOwnBoards = async ({ state, commit }) => {
  try {
    if(state.hasMore) {
      let offset = state.offset
      commit('INCREASE_OFFSET')
      let res = await axiosApi.get(`/boards/my?limit=${state.limit}&offset=${offset}`)
      if (res.data.boardList.length === 0) {
        commit('LOADING_FINISHED')
        return
      }
      commit('ADD_BOARDS', res.data.boardList)
    }
  } catch(err) {
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

const leaveBoard = async ({ state, commit }, boardId) => {
  try {
      const res = await axiosApi.delete(`/boards/${boardId}/users/me`)
      delete state.boards[boardId]
  } catch (err) {
      throw new Error(err)
  }
}

const deleteBoard = async ({ state, commit }, boardId) => {
  try {
      const res = await axiosApi.delete(`/boards/${boardId}`)
      delete state.boards[boardId]
  } catch (err) {
      throw new Error(err)
  }
}

const addBoards = (state, newBoards) => {
  newBoards.forEach(board => {
    state.boards[board.uuid] = board
  })
}

const increaseOffset = (state) => {
  state.offset += state.limit
}

const loadingFinished = (state) => {
  state.hasMore = false
}

const reset = (state) => {
  state.boards = {}
  state.offset = 0
  state.hasMore = true
}

const resetBoards = ({state, commit}) => {
  commit('RESET')
}

export default {
    namespaced: true,
    
    state: {
      hasMore: true,
      limit: 5,
      offset: 0,
      boards: {},
    },
    mutations: {
      ADD_BOARDS: addBoards,
      INCREASE_OFFSET: increaseOffset,
      LOADING_FINISHED: loadingFinished,
      RESET: reset
    },
    getters: {

    },
    actions: {
        createBoard,
        leaveBoard,
        deleteBoard,
        loadOwnBoards,
        loadBoardDetails,
        resetBoards,
    }
  }