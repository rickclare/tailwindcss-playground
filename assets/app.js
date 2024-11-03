const ws = new WebSocket("ws://localhost:8081")

ws.onmessage = (event) => {
  if (event.data === "reload") {
    window.location.reload()
  }
}
