const button1 = document.getElementById("MediaPlayerIcon-icon-play")
let audio1 = new Audio()
audio1.src = button1.getAttribute("data-mediathumb-url")
button1.addEventListener("click", function(){
  if button1.className == "MediaPlayerIcon icon-play" {
    button1.className = "MediaPlayerIcon icon-pause
    audio1.play()
  }else{
    button1.className = "MediaPlayerIcon icon-play"
    audio1.pause()
  }
});
