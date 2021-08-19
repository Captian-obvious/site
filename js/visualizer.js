window.onload = function() {
    var file = document.getElementById("thefile");
    const canvasContainer = document.getElementById("CanvasContainer");
    const z = 0
    var audio = document.getElementById('audio');
    var dur = document.getElementById('MediaPlayerControl-seekbar');
    var image = document.getElementById('media-icon');
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
                        
            x2 = 0;
                        
            analyser.getByteFrequencyData(dataArray);
            
            var curminutes = Math.floor(audio.currentTime/60);
            var curseconds = Math.ceil(audio.currentTime-(curminutes*60));
            var minutes = Math.floor(audio.duration/60);
            var seconds = Math.ceil(audio.duration-(minutes*60));
            position.innerHTML = curminutes+":"+curseconds+" / "+minutes+":"+seconds;
                        
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            var loud = dataArray[1];
            ctx.fillStyle = "#980000";
            ctx.fillRect(0, 0, audio.currentTime/audio.duration*WIDTH, 2);
            
            let angle_step = (Math.PI * 2)/bufferLength
            for (var i=0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                                
                var r = barHeight + (25 * (i/bufferLength));
                var g = 250 * (i/bufferLength);
                var b = 50;
                var angle = angle_step * i
                
                var y = centerY + loud/10 * Math.sin(angle)
                var x = centerX + loud/10 * Math.cos(angle)
                
                
                var y1 = centerY + loud/10 * (barHeight/40) * Math.sin(angle)
                var x1 = centerX + loud/10 * (barHeight/40) * Math.cos(angle)
                
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")"
                ctx.lineTo(x1,y1)
                ctx.stroke()
            }
            ctx.beginPath();
            ctx.arc(centerX, centerY, loud/10, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgb('+loud+', '+loud+',0)';
            ctx.fill();
            ctx.lineWidth = barWidth;
            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                                
                var r = barHeight + (25 * (i/bufferLength));
                var g = 250 * (i/bufferLength);
                var b = 50;
                
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x2, maxHeight + HEIGHT - barHeight, barWidth, barHeight)
                
                x2 += barWidth + 1;
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
