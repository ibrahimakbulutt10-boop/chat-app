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

// 🔊 DJ yayını geldiğinde sesi oynat
peerConnection.ontrack = (event) => {
  const audio = document.createElement("audio");
  audio.srcObject = event.streams[0];
  audio.autoplay = true;
  document.body.appendChild(audio);
};

// 🔁 ICE verilerini al
db.ref("webrtc/ice").on("child_added", async (snapshot) => {
  const candidate = new RTCIceCandidate(JSON.parse(snapshot.val()));
  await peerConnection.addIceCandidate(candidate);
});

// 📡 DJ’in teklifini al ve yanıtla
db.ref("webrtc/offer").on("value", async (snapshot) => {
  const offer = JSON.parse(snapshot.val());
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  db.ref("webrtc/answer").set(JSON.stringify(answer));
});

