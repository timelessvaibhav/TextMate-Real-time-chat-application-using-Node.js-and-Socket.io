// Node Server Which Will Handle Socket.io Connections

const io = require('socket.io')(8000,{
  cors:{
    origin: '*',
  }
});
const users = {};
// Creates a new socket everytime a new user joins
io.on('connection', socket =>{

  // Whenever a new user joins, let others connected to the server know
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // When Someone sends a message, broadcast it to other people
    socket.on('send',message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });
    
    // When Someone Leaves The room, let the other users know 
    socket.on('disconnect', message=>{
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
    });
})