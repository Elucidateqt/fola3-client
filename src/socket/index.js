import store from "../store";
import socket from "./socketio";

const handleErrors = (message) => {
  //assume no response as default case
  let alertConfig = {
    type: "negative",
    message: message,
    visible: true
  }
  store.commit("alert/SET_ALERT_CONFIG", alertConfig)
}

export default function createSocketIOPlugin() {
  return (store) => {

    socket.on('exception', (data) => {
      handleErrors(data.message)
    })
    socket.on('message', (data) => {
        let alertConfig = {
            type: "info",
            message: data.message,
            visible: true
          }
          store.commit("alert/SET_ALERT_CONFIG", alertConfig)
    })

    socket.on('setBoard', (data) => {
      store.commit("activeBoard/SET_ACTIVE_BOARD", data.board)
    })

    socket.on('playerJoined', (data) => {
      store.commit("activeBoard/ADD_PLAYER", data.user)
    })

    socket.on('playerLeft', (data) => {
      store.commit('activeBoard/REMOVE_PLAYER', data.userId)
    })

    socket.on('cardsCreated', (data) => {
      store.commit("activeBoard/CREATE_CARDS", {"cards": data.newCards, "playerId": data.location.playerId})
    })

    socket.on('interactionPlayed', (data) => {
      store.dispatch('activeBoard/playInteraction', data)
    })

    socket.on('interactionPickedUp', (data) => {
      store.dispatch('activeBoard/pickUpInteraction', data)
    })

    socket.on('cardAttached', (data) => {
      store.dispatch('activeBoard/attachCard', data)
    })

    socket.on('cardDetached', (data) => {
      store.dispatch('activeBoard/detachCard', data)
    })


    socket.on('cardAdded', (data) => {
      switch (data.location.container) {
        case "hand":
          store.commit("activeBoard/ADD_CARD_TO_PLAYER_HAND", {"card": data.card, "playerId": data.location.playerId})
          break;
        case "board":
          store.commit("activeBoard/UPDATE_CARD_ON_BOARD", {"card": data.card, "location": data.location})
          break;
        default:
          break;
      }
    })

    socket.on('cardDeleted', (data) => {
      store.dispatch('activeBoard/deleteCard', data)
    })

    socket.on('cardUpdated', (data) => {
      store.dispatch('activeBoard/updateCard', data)
    })
  }
}
