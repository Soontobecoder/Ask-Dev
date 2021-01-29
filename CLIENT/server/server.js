const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
    // allowedHeaders: ["allow"],
    // credentials: true
  }
})
// const { ExpressPeerServer } = require('peer')
// const peerServer = ExpressPeerServer(server,{
//   path: '/',
//   debug: true
// })

app.use(express.json())
// app.use('/peer',peerServer)

const rooms= {}

app.get('/listRoom',(req,res)=> {
  res.status(200).json(rooms)
})

io.on('connection', socket => {

  socket.on('join-room', (roomId, userId,jwt) => {
    if(rooms[roomId]) {
      rooms[roomId][jwt] = userId
    }else{
      rooms[roomId] = {
        [jwt] : userId
      }
    }
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
  socket.on('stop-sharing', roomId => {
    socket.to(roomId).broadcast.emit('stop-sharing')
  })
  socket.on('give-my-id', obj => {
    socket.to(obj.roomId).broadcast.emit('give-other-id',obj.ownPeerId)
  })

})

server.listen(3005, () => console.log(`server on port ${3005}`))