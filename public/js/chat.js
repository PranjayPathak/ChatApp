const socket = io();

// Elements
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#sendLocation");
const $messages =  document.querySelector("#messages")

// Templates 
const messageTemplate = document.querySelector("#messageTemplate").innerHTML; //inner HTML of the tempate
const locationTemplate = document.querySelector("#locationTemplate").innerHTML; //inner HTML of the location tempate
const sidebarTemplate = document.querySelector("#sidebarTemplate").innerHTML;

// Options(Query String)
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true});

const autoscroll = () =>{
   const $newMessage = $messages.lastElementChild;
    
   const newMessageStyles = getComputedStyle($newMessage);
   const newMessageMargin = parseInt(newMessageStyles.marginBottom);
   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

   const visibleHeight = $messages.offsetHeight;

   const containerHeight = $messages.scrollHeight;
   
   //how far have we scrolled
   const scrollOffset = $messages.scrollTop + visibleHeight;

   if(containerHeight - newMessageHeight <= scrollOffset){
     $messages.scrollTop = $messages.scrollHeight; //scrollto the bottom
   }
}

socket.on("newMessage",(message)=>{
    // rendering html template for the message   
    const html = Mustache.render(messageTemplate,{
       username: message.username, 
       message: message.text,
       createdAt: moment(message.createdAt).format('h:m a')
    });
   
    //inserting Mustache template
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll();
});

socket.on("locationMessage",(message)=>{
    // rendering html template for the message   
    const html = Mustache.render(locationTemplate,{
        username: message.username,
        url: message.url,
       createdAt: moment(location.createdAt).format('h:m a')
    });
   
    //inserting Mustache template
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll();
});

//when form is submitted
document.getElementById("messageForm").addEventListener("submit",(event)=>{
    event.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled');

    const message = event.target.elements.message.value;
    socket.emit("sendMessage",message,(res,err)=>{
        if(err){
            console.error(err);
        }
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();
        console.log(`status: ${res}`);
    });
});

socket.on("roomData",({room,users})=>{
const html = Mustache.render(sidebarTemplate,{
    room,
    users
});

document.querySelector("#sidebar").innerHTML = html;
});

//sending the location
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
});

socket.emit('join',{username,room}, (error)=>{
    if(error){
        alert(error);
        location.href = "/";
    }
});