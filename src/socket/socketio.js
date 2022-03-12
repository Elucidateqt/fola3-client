import {io} from 'socket.io-client'
const socket = io('http://localhost:3001',{
    path: "/socket/",
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  })

export default socket