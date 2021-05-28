//Dead Pixel
//Dead Pixel
//Dead Pixel
//Dead Pixel
//Dead Pixel
//Dead Pixel
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const filter = require("bad-words");
const {generateMessage, generateLocation} = require("./utils/messages.js")
const { addUser, removeUser, getUser, getUsersInRoom} = require("./utils/users.js");
const app = express();

const server = http.createServer(app); //usually express configures the server
const io = socketio(server);          // but raw http server is needed as argument

const publicDirectoryPath =  path.join(__dirname , "../public");
const port = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));


io.on("connection",(socket)=>{
   
    socket.on('join', (options, cb)=>{
       const {error , user} = addUser({id:socket.id , ...options})
       
       if(error){
           return cb(error);
       }
       socket.join(user.room);
       socket.emit("newMessage",generateMessage("Welcome!"));
       socket.broadcast.to(user.room).emit("newMessage",generateMessage(`${user.username} has joined`));
       io.to(user.room).emit("roomData",{
           room : user.room,
           users : getUsersInRoom(user.room)
       })
       cb();
    });

    socket.on("sendMessage",(message, cb)=>{
        const user = getUser(socket.id);
        const fil = new filter();
         
        if(fil.isProfane(message)){
            return cb("Profanity not allowed!");
        }
        io.to(user.room).emit("newMessage",generateMessage(user.username,message));
        cb("delivered");   
    });
    
    socket.on("disconnect",()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit("newMessage",generateMessage(`${user.username} has left`));
            io.to(user.room).emit("roomData",{
                room : user.room,
                users : getUsersInRoom(user.room)
            });
        }
    });

    socket.on("sendLocation",(pos,cb)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit("locationMessage",generateLocation(user.username,`https://www.google.com/maps?q=${pos.lat},${pos.long}`));
        cb("location shared");
    });

});

server.listen( port , (req,res) => {
    console.log(`server on port ${port}`);
});
