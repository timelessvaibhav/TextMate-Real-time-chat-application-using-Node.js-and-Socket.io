// Client side scripting

// establishing a connection with the node server
const socket = io('http://localhost:8000',{
    transports: ['websocket']
});
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

var audio = new Audio('message-sound.mp3');

const append = (message,position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if(position=='left'){
        audio.play();
    }
}
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

// Asks a user's name and let the server know, before letting them join;
const name = prompt("Enter Your name to join");
socket.emit('new-user-joined', name);


// When a new user joins, receive their name from the server
socket.on('user-joined', name=>{
    append(`${name} joined the chat`,'left');
})

// When someone sends a message 
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
})

// When someone leaves the chat
socket.on('left', name=>{
    append(`${name}:left the chat`,'left');
})

