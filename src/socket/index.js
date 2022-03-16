import store from "../store";
import socket from "./socketio";

const handleErrors = (err) => {
  //assume no response as default case
  let alertConfig = {
    type: "negative",
    message: `errors.http.no_response`,
    visible: true
  }
  if(err.response){
    alertConfig = {
      type: "negative",
      message: `errors.http.${err.response.status}`,
      visible: true
    }  
  }
  store.commit("alert/SET_ALERT_CONFIG", alertConfig)
}

export default function createSocketIOPlugin() {
  return (store) => {
    socket.on('message', (data) => {
        let alertConfig = {
            type: "info",
            message: data.message,
            visible: true
          }
          store.commit("alert/SET_ALERT_CONFIG", alertConfig)
    })

    socket.on('playInteraction', (data) => {
      store.commit("boards/ADD_INTERACTION_TO_ACTIVE_BOARD", data.card)
    })

    socket.on('addCard', (data) => {
      console.log("updateCardReceived")
      switch (data.location.container) {
        case "hand":
          store.commit("boards/ADD_CARD_TO_PLAYER_HAND", {"card": data.card, "playerId": data.location.playerId})
          break;
        case "board":
          store.commit("boards/UPDATE_CARD_ON_BOARD", {"card": data.card, "location": data.location})
          break;
        default:
          break;
      }
    })

    socket.on('removeCard', (data) => {
      switch (data.location.container) {
        case "hand":
          store.commit("boards/REMOVE_CARD_FROM_PLAYER_HAND", {"cardId": data.cardId, "playerId": data.location.playerId})
          break;
        case "board":
          console.log("remove card received by socket", data)
          store.commit("boards/REMOVE_CARD_FROM_BOARD", {"column": data.location.column, "index": data.location.index})
        default:
          break;
      }
    })

    socket.on('updateCard', (data) => {
      console.log("updateCardReceived", data)
      switch (data.location.container) {
        case "hand":
          store.commit("boards/UPDATE_CARD_IN_PLAYER_HAND", {"card": data.card, "playerId": data.location.playerId, "index": data.location.index})
          break;
        case "board":
          store.commit("boards/UPDATE_CARD_ON_BOARD", {"card": data.card, "column": data.location.column, "index": data.location.index})
          break;
        default:
          break;
      }
    })
  }
}
