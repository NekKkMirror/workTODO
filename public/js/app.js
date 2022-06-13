const socket = io()
const form = document.querySelector('#chat-form')
const chat = document.querySelector('.chat-messages')
const roomBlock = document.getElementById('room-name')
const usersUl = document.getElementById('users')

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

socket.emit('joinRoom', { username, room })

socket.on('message', data => {

  outputMessage(data)

  chat.scrollTop = chat.scrollHeight // scroll
})

socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room)
  outputUsers(users)
})

form.addEventListener('submit', e => {
  e.preventDefault()
  const msg = document.querySelector('#msg')
  
  socket.emit('chatMessage',  msg.value)

  msg.value = ''
  msg.focus()
})


function outputMessage(data, takeHeight) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `
    <p class="meta">${data.username} <span>${data.time}</span></p>
    <p class="text">${data.text}</p>
  `

  chat.insertAdjacentElement('beforeend', div)
}

function outputRoomName(room) {
  roomBlock.innerText = room 
}

function outputUsers(users) {
  const blockUsers = users.map( user => {
    return `<li>${user.username}</li>`
  })

  usersUl.insertAdjacentHTML('beforeend',...blockUsers)
}