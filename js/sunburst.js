const button = document.getElementById("MediaPlayerIcon-icon-play")
let audio1 = new Audio()
audio1.src = button1.getAttribute("data-mediathumb-url")
button.addEventListener("click", function(){
  var aud = document.getElementById("audio")
  if(this.className == 'MediaPlayerIcon-icon-pause'){
    this.className = "MediaPlayerIcon-icon-play";
    audio1.pause();
  }else{
    this.className = "MediaPlayerIcon-icon-pause";
    audio1.play();
  };
  aud.addEventListener("ended", function() {
    button.className = "MediaPlayerIcon-icon-play";
  });
});
