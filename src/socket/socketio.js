import {io} from 'socket.io-client'
const socket = io(`${process.env.VUE_APP_SOCKET_URL}:${process.env.VUE_APP_SOCKET_PORT}`,{
    path: "/socket/",
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  })

export default socket