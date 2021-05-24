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

const app = express();

const server = http.createServer(app); //usually express configures the server
const io = socketio(server);          // but raw http server is needed as argument

const publicDirectoryPath =  path.join(__dirname , "../public");
const port = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));

io.on("connection",(socket)=>{
    console.log("new socket connection");
    io.emit("newClient");
    // socket.emit("countUpdated" ,count); 

        socket.on("sendMessage",(message)=>{
            io.emit("newMessage",message);
        });
        
});



server.listen( port , (req,res) => {
    console.log(`server on port ${port}`);
});
