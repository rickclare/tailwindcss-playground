const ws = new WebSocket("ws://localhost:8001")

ws.onmessage = (event) => {
  if (event.data === "reload") {
    window.location.reload()
  }
}
