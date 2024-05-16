var video = document.querySelector("#video");
var canvas = document.querySelector("#canvas");
var file = document.querySelector("#videofile");
var videoControls = document.querySelector("#videoControls");
var videow = document.querySelector("#videow");
var snap = document.querySelector("#snap");
var save = document.querySelector("#save");
var videoInfo = document.querySelector("#videoInfo");
var snapSize = document.querySelector("#snapsize");
var context = canvas.getContext("2d");
var slider = document.querySelector("#slider");
var w, h, ratio;
//add loadedmetadata which will helps to identify video attributes

function timeUpdate() {
  slider.setAttribute("max", Math.ceil(video.duration));
  slider.value = video.currentTime;
  videoInfo.style.display = "block";
  videoInfo.innerHTML = [
    "Video size: " + video.videoWidth + "x" + video.videoHeight,
    "Video length: " + Math.round(video.duration * 10) / 10 + "sec",
    "Playback position: " + Math.round(video.currentTime * 10) / 10 + "sec",
  ].join("<br>");
}

function goToTime(video, time) {
  video.currentTime = Math.min(video.duration, Math.max(0, time));
  timeUpdate();
}

video.addEventListener("timeupdate", timeUpdate);

video.addEventListener(
  "loadedmetadata",
  function () {
    console.log("Metadata loaded");
    videow.value = video.videoWidth;
    videoInfo.innerHTML = [
      "Video size: " + video.videoWidth + "x" + video.videoHeight,
      "Video length: " + Math.round(video.duration * 10) / 10 + "sec",
    ].join("<br>");
    video.objectURL = false;
    video.play();
    video.pause();
    resize();
  },
  false
);

function resize() {
  ratio = video.videoWidth / video.videoHeight;
  w = videow.value;
  h = parseInt(w / ratio, 10);
  canvas.width = w;
  canvas.height = h;
}

function snapPicture() {
  context.fillRect(0, 0, w, h);
  context.drawImage(video, 0, 0, w, h);

  const container = document.querySelector("#outputs");
  const img = document.createElement("img");
  img.src = canvas.toDataURL();
  img.className = "output";
  img.addEventListener("click", () => selectImage(img));
  container.appendChild(img);
  snapSize.innerHTML = w + "x" + h;
}

function autoSnapPictureAfterPercent(percentage) {
  // Check if video is loaded
  if (!video.duration) {
    alert("Please load a video first");
    return;
  }

  const container = document.querySelector("#outputs");
  container.innerHTML = "";

  var interval = percentage * video.duration;
  var time = 0;

  // Loop through the video without delay and take a snapshot every 10% of the video
  var intervalID = setInterval(function () {
    goToTime(video, time);
    snapPicture();
    time += interval;
    if (time >= video.duration) {
      clearInterval(intervalID);
    }
  }, 200);
}

function autoSnapPictureAfterMin(minutes) {
  // Check if video is available
  if (!video.duration) {
    alert("Please load a video first");
    return;
  }

  const container = document.querySelector("#outputs");
  container.innerHTML = "";

  var interval = 60 * minutes;
  var time = 0;

  // Loop through the video without delay and take a snapshot every 1 minute
  var intervalID = setInterval(function () {
    goToTime(video, time);
    snapPicture();
    time += interval;
    if (time >= video.duration) {
      clearInterval(intervalID);
    }
  }, 200);
}

function selectImage(img) {
  // Find parent and remove selected class from all children except the selected one
  var parent = img.parentElement;
  var children = parent.children;
  for (let index = 0; index < children.length; index++) {
    const element = children[index];
    if (element != img) {
      element.classList.remove("selected");
    }
  }
  img.classList.add("selected");

  // Preview the selected image in the image with id "preview"
  var preview = document.querySelector("#preview");
  preview.src = img.src;
}

function selectVideo() {
  file.click();
}

function loadVideoFile() {
  var fileInput = file.files[0];
  if (fileInput) {
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
    if (video.objectURL && video.src) {
      URL.revokeObjectURL(video.src);
    }
    video.pleload = "metadata";
    video.objectURL = true;
    video.src = URL.createObjectURL(fileInput);
    videow.removeAttribute("readonly");
    snap.disabled = false;
    save.disabled = false;
    // Enable all buttons contains class "snap2"
    var snap2 = document.querySelectorAll(".snap2");
    for (let index = 0; index < snap2.length; index++) {
      const doc = snap2[index];
      doc.disabled = false;
    }
    videoControls.style.display = "";
  }
}

function loadVideoFromFile(file) {
  let reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function (e) {
    // The file reader gives us an ArrayBuffer:
    let buffer = e.target.result;
    // We have to convert the buffer to a blob:
    let videoBlob = new Blob([new Uint8Array(buffer)], { type: "video/mp4" });
    // The blob gives us a URL to the video file:
    let url = window.URL.createObjectURL(videoBlob);
    video.src = url;
  };
}

function loadVideoURL(url) {
  video.preload = "metadata";
  video.src = url;
  videow.removeAttribute("readonly");
  snap.disabled = false;
  save.disabled = false;
  // Disable all buttons contains class "snap2"
  var snap2 = document.querySelectorAll(".snap2");
  for (let index = 0; index < snap2.length; index++) {
    const doc = snap2[index];
    doc.disabled = true;
  }
}

function savePicture(btn) {
  // btn.disabled = true
  // var dataURL = canvas.toDataURL();
  // var link = document.getElementById("imagelink");
  // link.style.display = '';
  // link.style.opacity = 0
  // link.href = dataURL;
  // var rnd = Math.round((Math.random() * 10000));
  // link.setAttribute("download", "video-capture-" + rnd + ".png");
  // link.click();
  // setTimeout(function(){
  //   btn.disabled = false
  //   link.style.display = 'none';
  // },100)

  // Save the selected image
  var selected = document.querySelector(".selected");
  if (selected) {
    var dataURL = selected.src;
    var link = document.getElementById("imagelink");
    link.style.display = "";
    link.style.opacity = 0;
    link.href = dataURL;
    var rnd = Math.round(Math.random() * 10000);
    link.setAttribute("download", "video-capture-" + rnd + ".png");
    link.click();
    setTimeout(function () {
      link.style.display = "none";
    }, 100);
  }
}

window.addEventListener("load", function () {
  var buttons = document.querySelectorAll("button");
  for (let index = 0; index < buttons.length; index++) {
    var element = buttons[index];
    element.addEventListener("click", function () {
      var name = this.innerText.trim();
      var category = "button";
      if (this.getAttribute("category") == "controls") {
        name = "Video Controls";
        category = "controls";
      }
      var id = name.toLowerCase().replace(" ", "_");
      gtag("event", category + "-" + id, {});
    });
  }
});
