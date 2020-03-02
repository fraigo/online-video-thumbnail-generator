var video=document.querySelector('#video');
var canvas=document.querySelector('#canvas');
var file=document.querySelector('#videofile');
var videow=document.querySelector('#videow');
var snap=document.querySelector('#snap');
var context=canvas.getContext('2d');
var w,h,ratio;

//add loadedmetadata which will helps to identify video attributes

video.addEventListener('loadedmetadata', function() {
  console.log("Metadata loaded");
  videow.value = video.videoWidth;
  if (video.objectURL){
    URL.revokeObjectURL(video.src);
  }
  video.objectURL=false;
  video.play();
  video.pause();
  resize();
},false);

function resize(){
  ratio = video.videoWidth/video.videoHeight;
  w = videow.value;
  h = parseInt(w/ratio,10);
  canvas.width = w;
  canvas.height = h;
}

function snapPicture() {
  context.fillRect(0,0,w,h);
  context.drawImage(video,0,0,w,h);
}

function selectVideo(){
  file.click();
}

function loadVideoFile(){
  var fileInput = file.files[0];
  if (fileInput){
      console.log("Loading...");
      console.log(fileInput);
      /*
      var reader  = new FileReader();
      reader.addEventListener("error", function () {
        console.log("Error loading video data");
      });
      reader.addEventListener('progress',function(ev){
        console.log("progress", ev.loaded, ev.total, Math.round(ev.loaded*100.0/ev.total));
      });
      reader.addEventListener("load", function () {
          console.log("Video data loaded");
          video.preload="metadata";
          video.src = reader.result;
        }, false);
      reader.readAsDataURL(fileInput);
      */
      video.pleload="metadata";
      video.objectURL=true;
      video.src = URL.createObjectURL(fileInput);
      videow.disabled = false;
      snap.disabled = false;
  }
}

function loadVideoURL(url){
  video.preload="metadata";
  video.src = url;
  videow.disabled = false;
  snap.disabled = false;
}