const setAlertConfig = (state, data) => {
    state.message = data.message,
    state.type = data.type
    state.visible = data.visible
  }
  
  const setAlert = ({state, commit}, data) => {
    commit('SET_ALERT_CONFIG', data)
  }
  
  const resetAlert = ({state, commit}) => {
      commit('RESET')
  }
  
  const reset = (state) => {
    state.visible = false
    state.message = ''
    state.type = 'info'
  }
  
  const getAlertMessage = (state) => {
    return state.message
  }
  
  const getAlertVisibility = (state) => {
    return state.visible
  }
  
  const getAlertType = (state) => {
    return state.type
  }

export default {
    namespaced: true,
    
    state: {
        message : "",
        type: "info",
        visible: false,
    },
    mutations: {
        SET_ALERT_CONFIG: setAlertConfig,
        RESET: reset
    },
    getters: {
        alertMessage: getAlertMessage,
        alertVisible: getAlertVisibility,
        alertType: getAlertType
    },
    actions: {
        resetAlert: resetAlert,
        setAlert: setAlert 
    }
  }