const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

// Replace 'your-websocket-url' with your WebSocket server URL
const websocketUrl = "wss://134.209.121.252:8081"; // Make sure to use the correct WebSocket port (usually 8080)
const socket = new WebSocket(`${websocketUrl}?roomId=${roomId}`);

socket.addEventListener("open", () => {
  console.log("WebSocket connection opened:", socket);
});

socket.addEventListener("close", () => {
  console.log("WebSocket connection closed");
});

socket.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});

document.getElementById("button1").addEventListener("click", () => {
  sendButtonPress("button1");
});

document.getElementById("button2").addEventListener("click", () => {
  sendButtonPress("button2");
});

function sendButtonPress(button) {
  console.log("Sending button press:", button);
  const message = JSON.stringify({
    action: "buttonPress",
    button,
  });
  socket.send(message);
}

