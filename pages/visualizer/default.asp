<!DOCTYPE html>
<%
@LANGUAGE = "JavaScript"
%>
<html>
    <head>
        <link rel="apple-touch-icon" type="image/png" sizes="57x57" href="../../images/apple-icons/apple-icon-57x57.png">
        <link rel="apple-touch-icon" type="image/png" sizes="60x60" href="../../images/apple-icons/apple-icon-60x60.png">
        <link rel="apple-touch-icon" type="image/png" sizes="72x72" href="../../images/apple-icons/apple-icon-72x72.png">
        <link rel="apple-touch-icon" type="image/png" sizes="76x76" href="../../images/apple-icons/apple-icon-76x76.png">
        <link rel="apple-touch-icon" type="image/png" sizes="114x114" href="../../images/apple-icons/apple-icon-114x114.png">
        <link rel="apple-touch-icon" type="image/png" sizes="120x120" href="../../images/apple-icons/apple-icon-120x120.png">
        <link rel="apple-touch-icon" type="image/png" sizes="144x144" href="../../images/apple-icons/apple-icon-144x144.png">
        <link rel="apple-touch-icon" type="image/png" sizes="180x180" href="../../images/apple-icons/apple-icon-180x180.png">
        <link rel="apple-touch-icon" type="image/png" sizes="152x152" href="../../images/apple-icons/apple-icon.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="../../images/android-icons/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="96x96" href="../../images/favicon-96.png">
        <link rel="icon" type="image/png" sizes="32x32" href="../../images/favicon-32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="../../images/favicon.png">
        <link rel="mask-icon" type="image/svg" sizes="96x96" href="../../images/favicon-96.svg" color="#ff0000">
        <link rel="mask-icon" type="image/svg" sizes="32x32" href="../../images/favicon-32.svg" color="#ff0000">
        <link rel="mask-icon" type="image/svg" sizes="16x16" href="../../images/favicon.svg" color="#ff0000">
        <link rel="manifest" href="manifest.json">
        <link rel="stylesheet" href="../../css/visualizer.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.js"></script>
        <script src="https://unpkg.com/meyda@5.2.2/dist/web/meyda.min.js"></script>
        <title>MediaPlayer-V2 - Visualizer</title>
    </head>
    <body>
        <label for="thefile" id="file-label">
            Choose Audio File
        </label>
        <input type="file" accept="audio/*" id="thefile"></input>
        <div id="media-container">
             <%
             const id4 = window.jsmediatags
const meyda = window.Meyda
window.onload = function() {
    var file = document.getElementById("thefile");
    var filetitle = document.getElementById("file-label")
    const z = 0
    var container = document.getElementById('media-container')
    container.innerHTML = `
    <canvas id="canvas"></canvas>
    <div id="main">
        <div id="album">
            <div id="MediaPlayerControls">
                <div id="MediaPlayerIcon-icon-play" class="MediaPlayerIcon icon-play" data-mediathumb-url="src"></div>
                <div id="sound_options" class="MediaPlayerIcon icon-volume">
                <input id="volume" class="MediaPlayerControl-volume" type="range" max="100" min="0">
            </div>
            <input id="MediaPlayerControl-seekbar" type="range" name="rng" min="0" value="0">
            <div id="time-position"></div>
        </div>
    </div>
    `
    var audio = new Audio();
    console.log(audio)
    var dur = document.getElementById('MediaPlayerControl-seekbar');
    var album = document.getElementById('album')
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
        audio.src = SRC;
        audio.load();
        id4.read(files[0],{
        
            onSuccess: function(tag){
                console.log(tag);
                const data = tag.tags.picture.data;
                const format = tag.tags.picture.format;
                const title = tag.tags.title;
                const artist = tag.tags.artist;
                if (data && format) {
              
                    let str = "";
                    for (var o=0;o<data.length;o++) {
                        str+=String.fromCharCode(data[o]);
                    };
                    album.style.backgroundImage = "url(data:"+format+";base64,"+window.btoa(str)+")";
                }else{
                    album.style.backgroundImage = "url(../images/default/default-album-image.png)";
                };
                if (title != "" && artist != "") {
                    filetitle.textContent = artist+' - '+title
                }else{
                    filetitle.textContent = 'Unknown Artist and or Unspecified title'
                }
            },
            onError: function(error){
                console.log(error);
            },
        });
        audio.play()
        var context = new AudioContext();
        console.log(context);
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
        var loud = 0
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
        var dataArray1 = new Uint8Array(bufferLength);
                    
        var maxHeight = canvas.height/2;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
                        
        var barWidth = (WIDTH / bufferLength);
        var barHeight;
        
                        
        function renderFrame() {
            requestAnimationFrame(renderFrame);
                        
            // x2 = 0;
                        
            analyser.getByteFrequencyData(dataArray);
            analyser.getByteTimeDomainData(dataArray1);
            
            var curtime = formatTime(audio.currentTime);
            var time = formatTime(audio.duration);
            position.innerHTML = curtime+" / "+time
            loud = dataArray[0];
            ctx.clearRect(0,0,WIDTH,HEIGHT)
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
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
            ctx.closePath();
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
                dur.value = dur.max;
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
}
%>
        </div>
        <noscript>Please Enable Javascript to use this page</noscript>
    </body>
</html>
