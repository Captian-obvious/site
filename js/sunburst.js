const button = document.getElementById("MediaPlayerIcon-icon-play")
const position = document.getElementById("time-position")
const dur = document.getElementById("")
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
dur.addEventListener("change", function() {
  audio.currentTime = dur.value
})
audio1.addEventListener("timeupdate", function() {
  var curminutes = Math.floor(audio.currentTime/60)
  var curseconds = Math.ceil(audio.currentTime-(curminutes*60))
  var minutes = Math.floor(audio.duration/60)
  var seconds = Math.ceil(audio.duration-(minutes*60))
  dur.value=audio.currentTime; 
  dur.max = audio.duration;
  position.innerHTML = curminutes+":"+curseconds+" / "+minutes+":"+seconds
});
