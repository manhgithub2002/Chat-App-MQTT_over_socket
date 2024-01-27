const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Kết nối đến MQTT Broker
const mqttClient = mqtt.connect("mqtt://localhost:1883");

app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));

mqttClient.on("connect", () => {
  console.log("MQTT client connected");
});

// Kết nối đến Socket.IO
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Nhận tin nhắn từ client qua Socket.IO và gửi tới MQTT Broker
  socket.on("message", (msg) => {
    const userName = msg.userName;
    const content = msg.content;

    mqttClient.publish("chat", JSON.stringify({ userName, content }));
  });
});

// Nhận tin nhắn từ MQTT và gửi tới client qua Socket.IO
mqttClient.subscribe("chat");
mqttClient.on("message", (topic, message) => {
  if (topic === "chat") {
    const { userName, content } = JSON.parse(message.toString());
    console.log(content);

    io.emit("message", { userName, content });
  }
});

// Serve HTML trang chat
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Chạy server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
