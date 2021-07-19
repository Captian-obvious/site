window.onload = function() {
    var file = document.getElementById("thefile");
    const canvasContainer = document.getElementById("CanvasContainer");
    var audio = document.getElementById('audio');
    var dur = document.getElementById('MediaPlayerControl-seekbar')
    var image = document.getElementById('media-icon')
    var dataimage = document.getElementById("MediaPlayerIcon-icon-play")
    var button = document.getElementById("MediaPlayerIcon-icon-play")
    var position = document.getElementById("time-position")
    file.onchange = function() {
        var files = this.files;
        var colorValue = "#ff0000"
        dataimage.setAttribute("data-mediathumb-url", URL.createObjectURL(files[0]));
        var SRC=dataimage.getAttribute("data-mediathumb-url");
        audio.src= SRC;
        audio.load();
        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        src.connect(analyser);
        analyser.connect(context.destination);
                        
        analyser.fftSize = 512;
        analyser.maxDecibels = -4
        analyser.minDecibels = -120
                        
        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
                        
        var dataArray = new Uint8Array(bufferLength);
                    
        var maxHeight = canvas.height/2
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
                        
        var barWidth = (WIDTH / bufferLength);
        var barHeight;
        var x = 0;
                        
        function renderFrame() {
            requestAnimationFrame(renderFrame);
                        
            x = 0;
                        
            analyser.getByteFrequencyData(dataArray);
                        
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            HEIGHT = canvas.height;
            var imageBlobData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = "#980000";
            ctx.fillRect(0, 0, audio.currentTime/audio.duration*WIDTH, 2)
            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                                
                var r = barHeight + (25 * (i/bufferLength));
                var g = 250 * (i/bufferLength);
                var b = 50;
                        
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, maxHeight+HEIGHT - barHeight, barWidth, barHeight);
                        
                x += barWidth + 1;
            }
        }
        renderFrame();
        audio.play();
        dur.addEventListener("change", function() {
            audio.currentTime = dur.value
        })
        audio.addEventListener("timeupdate", function() {
            dur.value=audio.currentTime; 
            dur.max = audio.duration;
            position.innerHTML = Math.floor(audio.currentTime*60)+":"+Math.ceil(audio.currentTime)+" / "+Math.floor(audio.duration*60)":"+Math.ceil(audio.duration)
        });
        button.addEventListener("click", function() {
            var aud = document.getElementById("audio")
            if(this.className == 'MediaPlayerIcon-icon-pause'){
                this.className = "MediaPlayerIcon-icon-play";
                aud.pause();
            }else{
                this.className = "MediaPlayerIcon-icon-pause";
                aud.play();
            };
            aud.addEventListener("ended", function() {
                button.className = "MediaPlayerIcon-icon-play";
                dur.value = dur.max
            });
        });
        audio.addEventListener("pause", function() {
            button.className = "MediaPlayerIcon-icon-play";
        });
        audio.addEventListener("play", function() {
            button.className = "MediaPlayerIcon-icon-pause";
        });
    }
    
};
