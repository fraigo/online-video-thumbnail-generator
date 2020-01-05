var video=document.querySelector('#video');
var canvas=document.querySelector('#canvas');
var file=document.querySelector('#videofile');
var videow=document.querySelector('#videow');
var snap=document.querySelector('#snap');
var context=canvas.getContext('2d');
var w,h,ratio;

//add loadedmetadata which will helps to identify video attributes

video.addEventListener('loadedmetadata', function() {
  videow.value = video.videoWidth;
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

function loadVideo(){
  var fileInput = file.files[0];
  if (fileInput){
      console.log(fileInput);
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          video.src = reader.result;
      }, false);
      reader.readAsDataURL(fileInput);
      videow.disabled = false;
      snap.disabled = false;
  }
}