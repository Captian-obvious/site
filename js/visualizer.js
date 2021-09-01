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
    var setting = document.getElementById("sound_options");
    var vol = document.getElementById("volume");
    file.onchange = function() {
        var files = this.files;
        var colorValue = "#ff0000";
        dataimage.setAttribute("data-mediathumb-url", URL.createObjectURL(files[0]));
        var SRC=dataimage.getAttribute("data-mediathumb-url");
        audio.src= SRC;
        audio.load();
        var context = new AudioContext();
        console.log(context);
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        src.connect(analyser);
        var gn = context.createGain();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        analyser.connect(gn);
        gn.connect(context.destination);
        var fft_Size = 512;
                        
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
            let rad = (loud/10);
            gn.gain.setValueAtTime(vol.value/100, audio.currentTime);
            /*
            ctx.lineWidth = barWidth;
            let angle_step = (Math.PI * 2)/bufferLength
            for (var i=0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                                
                var r = barHeight + (25 * (i/bufferLength));
                var g = 250 * (i/bufferLength);
                var b = 50;
                var angle = angle_step * i;
                
                var y = centerY + rad * Math.sin(angle);
                var x = centerX + rad * Math.cos(angle);
                
                
                var y1 = centerY + rad * (barHeight/50) * Math.sin(angle);
                var x1 = centerX + rad * (barHeight/50) * Math.cos(angle);
                
                var rgb = "rgb(" + r + "," + g + "," + b + ")";
                
                ctx.beginPath();
                ctx.moveTo(x,y);
                ctx.strokeStyle = rgb;
                ctx.lineTo(x1,y1);
                ctx.stroke();
            }
            */
            for (var i = 0; i < bufferLength; i++) {
               barHeight = dataArray[i];
               ctx.save()
               ctx.translate(centerX, centerY)
               ctx.rotate(90+i*((Math.PI*2)/bufferLength))

               var r = barHeight + (25 * (i/bufferLength));
               var g = 250 * (i/bufferLength);
               var b = 50;

               ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
               ctx.fillRect(0,0+rad, barWidth, barHeight/3.5)
               ctx.fillStyle = "rgb(255,255,255)";
               ctx.fillRect(0,0+rad+barHeight/3.5, barWidth, 1)
               ctx.restore()
            }
            ctx.beginPath();
            ctx.arc(centerX, centerY,rad, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgb('+loud+', '+loud+',0)';
            ctx.fill();
        }
        renderFrame();
        audio.play();
        dur.addEventListener("change", function() {
            audio.currentTime = dur.value
        })
        setting.addEventListener("click", function() {
            if (vol.hidden == true) {
                vol.hidden = false
            }else{
                vol.hidden = true
            }
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

