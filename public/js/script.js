const socket = io();
var userName;

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});
// Get the modal
const configModal = document.getElementById("configModal");
// Get the button that opens the modal
const configBtn = document.getElementById("config-btn");
// Get the <span> element that closes the modal
const configSpan = document.getElementById("configClose");

// When the user clicks the button, open the modal
configBtn.onclick = function () {
  configModal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
configSpan.onclick = function () {
  configModal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == configModal) {
    configModal.style.display = "none";
  }
};

// Allow message to be sent by pressing the enter key (to escape, use alt+enter)
const input = document.getElementById("msg-text");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    if (!event.altKey) {
      event.preventDefault();
      document.getElementById("send-btn").click();
    } else {
      input.value += "\r\n";
    }
  }
});

// Create a new MQTT chat instance and add event listeners
// for buttons.
const configButton = document.getElementById("submit-config");
configButton.onclick = function () {
  userName = document.getElementById("nick").value;
  configModal.style.display = "none";
  document.getElementById("msg-text").disabled = false;
};

function sendMessage() {
  console.log("1");
  const messageInput = document.getElementById("msg-text");
  const message = messageInput.value.trim();

  if (message !== "") {
    const messageData = {
      userName: userName,
      content: message,
    };
    // Gửi tin nhắn tới server
    socket.emit("message", messageData);

    displayMessage(messageData, "sent");
    // Xóa nội dung input
    messageInput.value = "";
  }
}

function displayMessage(messageData, senderClass) {
  const msgText = messageData.content;
  const nickname = messageData.userName;

  const msg = document.createElement("DIV");
  msg.classList.add("message", senderClass);
  const text = document.createElement("P");
  text.appendChild(document.createTextNode(msgText));
  msg.appendChild(text);
  const name = document.createElement("SPAN");
  name.innerHTML = nickname;
  name.classList.add("msg-name");
  msg.appendChild(name);
  const msgBox = document.getElementById("msg-view");
  msgBox.appendChild(msg);
  msgBox.scrollTop = msgBox.scrollHeight;
}

function receiveMessage(msgPayload) {
  console.log(msgPayload);
  const nickname = msgPayload.userName;
  if (nickname != userName) {
    displayMessage(msgPayload, "received");
  }
}
// Lắng nghe sự kiện khi nhận được tin nhắn từ server
socket.on("message", (messageData) => {
  receiveMessage(messageData);
});
