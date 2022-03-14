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
  }
}
