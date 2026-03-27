
let deferredPrompt;

// Install button
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  btn.style.display = 'block';

  btn.addEventListener('click', () => {
    deferredPrompt.prompt();
  });
});

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

// Save files in localStorage
document.getElementById("saveFileBtn").addEventListener("click", () => {
  const input = document.getElementById("fileInput");
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    let files = JSON.parse(localStorage.getItem("files") || "[]");
    files.push({name: file.name, data: e.target.result});
    localStorage.setItem("files", JSON.stringify(files));
    loadFiles();
  };
  reader.readAsDataURL(file);
});

function loadFiles() {
  const list = document.getElementById("fileList");
  list.innerHTML = "";
  let files = JSON.parse(localStorage.getItem("files") || "[]");

  files.forEach(f => {
    let li = document.createElement("li");
    li.textContent = f.name;
    list.appendChild(li);
  });
}

loadFiles();

// Notifications
document.getElementById("notifyBtn").addEventListener("click", () => {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      new Notification("App lista 🚀");
    }
  });
});
1

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado'));
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }
});