const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const path = require('path')
const { formatMessage } = require('./utils/messages')
const { getCurrentUser, userJoin, userLeave, getRoomUsers } = require('./utils/users')

const port = process.env.PORT || 3000
const io = new Server(server)
const botName = 'nikmes bot'

app.use(express.static(path.resolve(path.join(__dirname, 'public'))))

server.listen(port, () => console.log('Sever listen at ' + port))

io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    socket.emit('message', formatMessage(botName, 'Welcome to the nikmes'))
    
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(username, `${username} are join to the chat`)
      )

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  
  })

  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, msg))
  })

  socket.on('disconnect', () => {
    const user = userLeave(socket.id)

    const room = user.room

    io
      .to(room)
      .emit('message',  formatMessage(botName, `${user.username} left the chat`))
  })
})

