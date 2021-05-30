window.onload = function() {
    var file = document.getElementById("thefile");
    var audio = document.getElementById('audio');
    var dur = document.getElementById('MediaPlayerControls-seekbar')
    var image = document.getElementById('media-icon')
    var button = document.getElementById("MediaPlayerIcon-icon-play")
    file.onchange = function() {
        var files = this.files;
        var colorValue = "#ff0000"
        audio.src = URL.createObjectURL(files[0]);
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
                        
        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;
                        
        function renderFrame() {
            requestAnimationFrame(renderFrame);
                        
            x = 0;
                        
            analyser.getByteFrequencyData(dataArray);
                        
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            HEIGHT = canvas.height;
                        
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
       document.getElementById("MediaPlayerIcon-icon-play").className = "MediaPlayerIcon-icon-pause";
        document.getElementById("MediaPlayerIcon-icon-play").innerHTML = "<img id='media-icon' width='30px' height='30px' src='../../images/pause-icon.svg' color='"+colorValue+"'>";
        dur.addEventListener("change", function() {
            audio.currentTime = dur.value
        })
        audio.addEventListener("timeupdate", function() {
            dur.value=audio.currentTime; 
            dur.max = audio.duration;
        });
        document.getElementById("MediaPlayerIcon-icon-play").addEventListener("click", function() {
            var aud = document.getElementById("audio")
            if(this.className == 'MediaPlayerIcon-icon-pause'){
                this.className = "MediaPlayerIcon-icon-play";
                this.innerHTML = "<img id='media-icon' width='30px' height='30px' src='../../images/play-icon.svg' color='"+colorValue+"'>";
                aud.pause();
            }else{
                this.className = "MediaPlayerIcon-icon-pause";
                this.innerHTML = "<img id='media-icon' width='30px' height='30px' src='../../images/pause-icon.svg' color='"+colorValue+"'>";
                aud.play();
            };
            aud.addEventListener("ended", function() {
                document.getElementById("MediaPlayerIcon-icon-play").className = "MediaPlayerIcon-icon-play";
                document.getElementById("MediaPlayerIcon-icon-play").innerHTML = "<img id='media-icon' width='30px' height='30px' src='../../images/play-icon.svg'>";
                dur.value = dur.max
            });
        });
        audio.addEventListener("pause", function() {
            document.getElementById("MediaPlayerIcon-icon-play").className = "MediaPlayerControls-media-icon-play";
            document.getElementById("MediaPlayerIcon-icon-play").innerHTML = "<img id='media-icon' width='30px' height='30px' src='../../images/play-icon.svg' color='"+colorValue+"'>";
        });
        audio.addEventListener("play", function() {
            document.getElementById("MediaPlayerIcon-icon-play").className = "MediaPlayerIcon-icon-pause";
            document.getElementById("MediaPlayerIcon-icon-play").innerHTML = "<img id='media-icon' width='30px' height='30px' src='../../images/pause-icon.svg' color='"+colorValue+"'>";
        });
    }
    
};