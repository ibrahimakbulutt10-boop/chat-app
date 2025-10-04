// Firebase yapılandırması
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

// DJ olarak katılma
document.getElementById("dj-enter").addEventListener("click", () => {
  const nickname = document.getElementById("dj-nickname").value.trim();
  const color = document.getElementById("dj-color").value;
  if (nickname !== "") {
    const userId = Date.now().toString();
    db.ref("users/" + userId).set({ nickname, color, isDJ: true });
    localStorage.setItem("userId", userId);
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("color", color);
    localStorage.setItem("isDJ", "true");
    alert("DJ olarak katıldınız!");
  }
});

// Kullanıcıları listele + sağ tıkla uyar/ban
db.ref("users").on("child_added", (snapshot) => {
  const user = snapshot.val();
  const div = document.createElement("div");
  div.className = "user-card";
  div.innerText = user.nickname;
  div.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (localStorage.getItem("isDJ") === "true") {
      showUserMenu(snapshot.key);
    }
  });
  document.getElementById("user-list").appendChild(div);
});

function showUserMenu(userId) {
  const menu = document.createElement("div");
  menu.className = "context-menu";
  menu.innerHTML = `
    <button onclick="warnUser('${userId}')">⚠️ Uyar</button>
    <button onclick="banUser('${userId}')">🚫 Banla</button>
  `;
  document.body.appendChild(menu);
  setTimeout(() => menu.remove(), 3000);
}

function warnUser(id) {
  db.ref(`warnings/${id}`).push({ reason: "DJ uyarısı", time: Date.now() });
}

function banUser(id) {
  db.ref(`banned/${id}`).set(true);
}

// Bilgisayardan dosya seçip çal
document.getElementById("local-track").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const audio = document.getElementById("audio-player");
    audio.src = URL.createObjectURL(file);
    audio.play();
  }
});

// URL girip çal
document.getElementById("play-url").addEventListener("click", () => {
  const url = document.getElementById("url-input").value.trim();
  if (url !== "") {
    const audio = document.getElementById("audio-player");
    audio.src = url;
    audio.play();
  }
});

// Mikrofon yayını (bas-konuş)
const micButton = document.getElementById("mic-btn");
const micStatus = document.getElementById("mic-status");
let micStream;

micButton.addEventListener("mousedown", async () => {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStatus.innerText = "🎙️ Yayında";
    const audio = new Audio();
    audio.srcObject = micStream;
    audio.play();
  } catch (err) {
    alert("Mikrofon erişimi reddedildi.");
  }
});

micButton.addEventListener("mouseup", () => {
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStatus.innerText = "🎙️ Kapalı";
  }
});

