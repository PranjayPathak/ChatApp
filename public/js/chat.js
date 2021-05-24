const socket = io();


socket.on("newClient",()=>{
    console.log("Welcome new one");
})

socket.on("newMessage",(message)=>{
    console.log(message);
})


// socket.on("countUpdated",(count)=>{
//     console.log(`count ${count}`);
// })

document.getElementById("messageForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const message = document.querySelector("input").value;
    socket.emit("sendMessage",message);
})