const socket = io();


// Elements
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#sendLocation");
const $messages =  document.querySelector("#messages")

// Templates
socket.on("newMessage",(message)=>{
    console.log(message);
});

document.getElementById("messageForm").addEventListener("submit",(event)=>{
    event.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled');
    

    const message = event.target.elements.message.value;
    socket.emit("sendMessage",message,(res,err)=>{
        if(err){
            console.log(err);
        }
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();
        console.log(`status: ${res}`);
    });
});

document.getElementById("sendLocation").addEventListener("click",()=>{
   if(!navigator.geolocation){
      return( alert("geolcation is not supported by your browser") );
   }
   $locationButton.setAttribute('disabled','disabled');
   navigator.geolocation.getCurrentPosition((pos)=>{
     socket.emit("sendLocation",{
         "lat":pos.coords.latitude,
         "long":pos.coords.longitude
    },(res)=>{
        console.log(`status: ${res}`);
        $locationButton.removeAttribute('disabled');
    });
   });
   
})

