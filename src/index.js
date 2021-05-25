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
const app = express();

const server = http.createServer(app); //usually express configures the server
const io = socketio(server);          // but raw http server is needed as argument

const publicDirectoryPath =  path.join(__dirname , "../public");
const port = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));

io.on("connection",(socket)=>{
    socket.emit("newMessage","WELCOME");
    socket.broadcast.emit("newMessage","new user has joined");

    socket.on("sendMessage",(message, cb)=>{
        const fil = new filter();
         
        if(fil.isProfane(message)){
            return cb("Profanity not allowed!");
        }
        io.emit("newMessage",message);
        cb("delivered");   
    });
    
    socket.on("disconnect",()=>{
        io.emit("newMessage","a user has left")
    });

    socket.on("sendLocation",(pos,cb)=>{
        io.emit("newMessage",`https://www.google.com/maps?q=${pos.lat},${pos.long}`);
        cb("location shared");
    });

});

server.listen( port , (req,res) => {
    console.log(`server on port ${port}`);
});
