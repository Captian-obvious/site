import { jsmediatags } from "https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js"
function read(obj) {
    var tags = {};
    var id3 = window.jsmediatags
    id3.read(obj.src, {
       onSuccess: function(tag) {
          tags = tag;
       }, 
       onError: function(error) {
          // handle error
          console.log(error);
       }
    });
    return tags
}
window.onload = function() {
    var file = document.getElementById("thefile");
    const canvasContainer = document.getElementById("CanvasContainer");
    const z = 0
    var audio = new Audio();
    console.log(audio)
    var dur = document.getElementById('MediaPlayerControl-seekbar');
    var image = document.getElementById('album-image');
    var dataimage = document.getElementById("MediaPlayerIcon-icon-play");
    var button = document.getElementById("MediaPlayerIcon-icon-play");
    var position = document.getElementById("time-position");
    file.onchange = function() {
        var files = this.files;
        var colorValue = "#ff0000";
        dataimage.setAttribute("data-mediathumb-url", URL.createObjectURL(files[0]));
        var SRC=dataimage.getAttribute("data-mediathumb-url");
        audio.src= SRC;
        audio.load();
        var tags = read(audio)
        var picture = tags.tags.picture; // create reference to track art
        var base64String = "";
        for (var i = 0; i < picture.data.length; i++) {
            base64String += String.fromCharCode(picture.data[i]);
        }
        var imageUri = "data:" + picture.format + ";base64," + window.btoa(base64String);
        image.src = imageUri
        var context = new AudioContext();
        console.log(context)
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        src.connect(analyser);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        analyser.connect(context.destination);
        
        var fft_Size = 512
                        
        analyser.fftSize = fft_Size;
        analyser.maxDecibels = -3;
        analyser.minDecibels = -120;
                        
        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        console.log(analyser)
                        
        var dataArray = new Uint8Array(bufferLength);
                    
        var maxHeight = canvas.height/2;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
                        
        var barWidth = (WIDTH / bufferLength);
        var barHeight;
        var x2 = 0;
        
                        
        function renderFrame() {
            requestAnimationFrame(renderFrame);
                        
            // x2 = 0;
                        
            analyser.getByteFrequencyData(dataArray);
            
            var curtime = formatTime(audio.currentTime)
            var time = formatTime(audio.duration);
            position.innerHTML = curtime+" / "+time
                        
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            var loud = dataArray[1];
            ctx.fillStyle = "#980000";
            ctx.fillRect(0, 0, audio.currentTime/audio.duration*WIDTH, 2);
            let rad = (loud/10)
            
            let angle_step = (Math.PI * 2)/bufferLength
            for (var i=0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                                
                var r = barHeight + (25 * (i/bufferLength));
                var g = 250 * (i/bufferLength);
                var b = 50;
                var angle = angle_step * i
                
                var y = centerY + rad * Math.sin(angle)
                var x = centerX + rad * Math.cos(angle)
                
                
                var y1 = centerY + rad * (barHeight/50) * Math.sin(angle)
                var x1 = centerX + rad * (barHeight/50) * Math.cos(angle)
                
                var rgb = "rgb(" + r + "," + g + "," + b + ")"
                
                ctx.beginPath()
                ctx.moveTo(x,y)
                ctx.strokeStyle = rgb
                ctx.lineTo(x1,y1)
                ctx.stroke()
            }
            ctx.beginPath();
            ctx.arc(centerX, centerY,rad, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgb('+loud+', '+loud+',0)';
            ctx.fill();
            ctx.lineWidth = barWidth;
           /*
           for (var i = 0; i < bufferLength; i++) {
               barHeight = dataArray[i];
               ctx.save()
               ctx.translate(centerX, centerY)
               ctx.rotate(i*((Math.PI*2)/bufferLength)

               var r = barHeight + (25 * (i/bufferLength));
               var g = 250 * (i/bufferLength);
               var b = 50;

               ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
               ctx.fillRect(x2, maxHeight + HEIGHT - barHeight, barWidth, barHeight)

               x2 += barWidth + 1;
               ctx.restore()
           }
           */
        }
        renderFrame();
        audio.play();
        dur.addEventListener("change", function() {
            audio.currentTime = dur.value
        })
        audio.addEventListener("timeupdate", function() {
            dur.value=audio.currentTime; 
            dur.max = audio.duration;
        });
        button.addEventListener("click", function() {
            if(this.className == 'MediaPlayerIcon icon-pause'){
                this.className = "MediaPlayerIcon icon-play";
                audio.pause();
            }else{
                this.className = "MediaPlayerIcon icon-pause";
                audio.play();
            };
            audio.addEventListener("ended", function() {
                button.className = "MediaPlayerIcon icon-play";
                dur.value = dur.max
            });
        });
        audio.addEventListener("pause", function() {
            button.className = "MediaPlayerIcon icon-play";
        });
        audio.addEventListener("play", function() {
            button.className = "MediaPlayerIcon icon-pause";
        });
    }
    function formatTime(val) {
        var min = Math.floor((val/60))
        var sec = Math.floor(val - (min * 60))
        if (sec < 10) {sec = '0'+sec}
        return min+':'+sec
    }
};

