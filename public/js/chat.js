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

// Options(Query String)
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true});

socket.on("newMessage",(message)=>{
    // rendering html template for the message   
    console.log(message.text);
    const html = Mustache.render(messageTemplate,{
       message: message.text,
       createdAt: moment(message.createdAt).format('h:m a')
    });
   
    //inserting Mustache template
    $messages.insertAdjacentHTML("beforeend",html)
});

socket.on("locationMessage",(location)=>{
    // rendering html template for the message   
    const html = Mustache.render(locationTemplate,{
       url: location.url,
       createdAt: moment(location.createdAt).format('h:m a')
    });
   
    //inserting Mustache template
    $messages.insertAdjacentHTML("beforeend",html)
});

//when form is submitted
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

socket.emit('join',{username,room});