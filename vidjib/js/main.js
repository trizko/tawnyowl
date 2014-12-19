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
var localPeerConnection;
var remotePeerConnection;

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

function errorCallback (error) {
  console.log("navigator.getUserMedia error: " + error);
}

function gotStreamSuccess (stream) {
  console.log("got local stream");
  localVideo.src = URL.createObjectURL(stream);
  localStream = stream;
  callButton.disabled = false;
}

function start () {
  console.log('requesting local stream');
  startButton.disabled = true;
  navigator.getUserMedia(constraints, gotStreamSuccess, errorCallback);
}

function call () {
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

  var servers = null;

  localPeerConnection = new RTCPeerConnection(servers);
  console.log("Created local peer connection object localPeerConnection");
  localPeerConnection.onicecandidate = gotLocalIceCandidate;

  remotePeerConnection = new RTCPeerConnection(servers);
  console.log("Created remote peer connection object remotePeerConnection");
  remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
  remotePeerConnection.onaddstream = gotRemoteStream;

  localPeerConnection.addStream(localStream);
  console.log("Added localStream to localPeerConnection");
  localPeerConnection.createOffer(gotLocalDescription,handleError);
}

function gotLocalDescription(description){
  localPeerConnection.setLocalDescription(description);
  console.log("Offer from localPeerConnection: \n" + description.sdp);
  remotePeerConnection.setRemoteDescription(description);
  remotePeerConnection.createAnswer(gotRemoteDescription,handleError);
}

function gotRemoteDescription(description){
  remotePeerConnection.setLocalDescription(description);
  console.log("Answer from remotePeerConnection: \n" + description.sdp);
  localPeerConnection.setRemoteDescription(description);
}

function hangup() {
  console.log("Ending call");
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
}

function gotRemoteStream(event){
  remoteVideo.src = URL.createObjectURL(event.stream);
  console.log("Received remote stream");
}

function gotLocalIceCandidate(event){
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    console.log("Local ICE candidate: \n" + event.candidate.candidate);
  }
}

function gotRemoteIceCandidate(event){
  if (event.candidate) {
    localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    console.log("Remote ICE candidate: \n " + event.candidate.candidate);
  }
}

function handleError(){}

