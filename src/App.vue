<template>
  <div id="app">
    <h1>Scan the QR code with your phone</h1>
    <canvas ref="qrcode"></canvas>
    <h3>Room ID: {{ roomId }}</h3>
    <h2>Button Events:</h2>
    <ul>
      <li v-for="(event, index) in buttonEvents" :key="index">{{ event }}</li>
    </ul>
  </div>
</template>

<!-- the rest of the file remains the same -->


<script>
import QRCode from "qrcode";

export default {
  data() {
    return {
      socket: null,
      roomId: null,
      buttonEvents: [],
    };
  },
  mounted() {
    this.initQRCode();
    this.initWebSocket();
  },
  methods: {
    async initQRCode() {
      this.roomId = Math.random().toString(36).substring(2, 15);

      try {
        await QRCode.toCanvas(this.$refs.qrcode, `${location.origin}/controller.html?roomId=${this.roomId}`, {
          width: 256,
          height: 256,
        });
      } catch (err) {
        console.error(err);
      }
    },
    initWebSocket() {
      const websocketUrl = process.env.VUE_APP_WEBSOCKET_URL;
      this.socket = new WebSocket(`${websocketUrl}?roomId=${this.roomId}`);

      this.socket.addEventListener("open", () => {
        console.log("WebSocket connection opened:", this.socket);
      });

this.socket.addEventListener("message", async (event) => {
  console.log("WebSocket message received:", event.data);
  const message = await event.data.text();
  console.log("WebSocket message text:", message);

  const parsedMessage = JSON.parse(message);

  if (parsedMessage.action === "buttonPress") {
    switch (parsedMessage.button) {
      case "button1":
        this.buttonEvents.push("Button 1 pressed");
        break;
      case "button2":
        this.buttonEvents.push("Button 2 pressed");
        break;
    }
  }
});


      this.socket.addEventListener("close", () => {
        console.log("WebSocket connection closed");
      });

      this.socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}
</style>
