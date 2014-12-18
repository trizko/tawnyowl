////////////////////////////////////////////////////////////
// Initializing sockets
////////////////////////////////////////////////////////////

var socket = io();

$('form').submit(function(){
  socket.emit('message', $('#msg').val());
  $('#msg').val('');
  return false;
})
socket.on('msgtodisplay', function(msg){
  $('ul').append($('<li>').text(msg))
})

////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

////////////////////////////////////////////////////////////
// Setup RTC peer connection
////////////////////////////////////////////////////////////

var localStream;

var localVideo = $('#localVideo').get(0);
var remoteVideo = $('#remoteVideo').get(0);
var startButton = $('#startButton').get(0);
var callButton = $('#callButton').get(0);
var hangupButton = $('#hangupButton').get(0);

startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

//////////////////////////////
// Get local video stream
//////////////////////////////

// performance fn to be added (trace)

var constraints = {video: true, audio: true};

var errorCallback = function(error) {
  console.log("navigator.getUserMedia error: " + error);
}

var gotStreamSuccess = function(stream) {
  console.log("got local stream");
  localVideo.src = URL.createObjectURL(stream);
  localStream = stream;
  callButton.disabled = false;
}

var start = function() {
  console.log('requesting local stream');
  startButton.disabled = true;
  navigator.getUserMedia(constraints, gotStreamSuccess, errorCallback);
}

var call = function() {
  callButton.disabled = true;
  hangupButton.disabled = false;
  console.log('starting call');
  //check presence of local video and audio 
  if (localStream.getVideoTracks().length > 0) {
    console.log('Using video device: ' + localStream.getVideoTracks()[0].label);
  }
  if (localStream.getAudioTracks().length > 0) {
    console.log('Using audio device: ' + localStream.getAudioTracks()[0].label);
  }
  
}