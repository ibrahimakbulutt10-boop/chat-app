const firebaseConfig = {
  apiKey: "AIzaSyDScnST7m9TrW67Fz-UYljEfUr9YZxBHF8",
  authDomain: "radyoapp-81787.firebaseapp.com",
  databaseURL: "https://radyoapp-81787-default-rtdb.firebaseio.com",
  projectId: "radyoapp-81787",
  storageBucket: "radyoapp-81787.appspot.com",
  messagingSenderId: "788981302037",
  appId: "1:788981302037:web:778f82c0cfb6492c1a1f1c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const peerConnection = new RTCPeerConnection();

// 🔊 Müzik + Mikrofon stream’i birleştir
async function startDJStream() {
  const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audio = new Audio("your-music.mp3"); // veya dış URL
  audio.play();
  const musicStream = audio.captureStream();

  const combinedStream = new MediaStream([
    ...micStream.getAudioTracks(),
    ...musicStream.getAudioTracks()
  ]);

  combinedStream.getTracks().forEach(track => peerConnection.addTrack(track, combinedStream));

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  db.ref("webrtc/offer").set(JSON.stringify(offer));
}

// 🔁 ICE paylaşımı
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    db.ref("webrtc/ice").push(JSON.stringify(event.candidate));
  }
};

startDJStream();

