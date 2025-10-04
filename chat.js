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

// Sohbete katılma
document.getElementById("enter-chat").addEventListener("click", () => {
  const nickname = document.getElementById("nickname").value.trim();
  const color = document.getElementById("nick-color").value;
  if (nickname !== "") {
    const userId = Date.now().toString();
    db.ref("users/" + userId).set({ nickname, color, isDJ: false });
    localStorage.setItem("userId", userId);
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("color", color);
    alert("Sohbete katıldınız!");
  }
});

// Mesaj gönderme
function sendMessage() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  const nickname = localStorage.getItem("nickname");
  const color = localStorage.getItem("color");

  if (text !== "" && nickname) {
    db.ref("chat").push({ nickname, color, text });
    input.value = "";
  }
}

// Mesajları listeleme
const messagesDiv = document.getElementById("messages");
db.ref("chat").on("child_added", (snapshot) => {
  const msg = snapshot.val();
  const p = document.createElement("p");
  p.innerHTML = `<span style="color:${msg.color}; font-weight:bold;">${msg.nickname}:</span> ${msg.text}`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Butonlar ve Enter tuşu
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("send-btn").addEventListener("click", sendMessage);
  document.getElementById("message-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  document.getElementById("clear-btn").addEventListener("click", () => {
    document.getElementById("message-input").value = "";
  });
});

