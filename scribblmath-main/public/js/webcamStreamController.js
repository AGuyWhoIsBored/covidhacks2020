// code that will manage webcam streams and mics

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {                    // <-- IF STREAMS ARE NOT CONNECTING, DO NOT USE LOCAL PEERJS SERVER AND USE DEFAULT 0.PEERJS.COM SERVER!!
                                                        // IF WE ARE USING LOCAL SERVER, MAKE SURE TO RUN IT!!
  //host: '/',
  //port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    console.log("answered call");
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log("video stream created");
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  console.log("new user connected to room");
  const call = myPeer.call(userId, stream)
  console.log("call", call);
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    console.log("stream added");
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}