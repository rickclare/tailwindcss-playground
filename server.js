import { serve } from "bun"
import { WebSocketServer } from "ws"
import chokidar from "chokidar"
import debounce from "lodash.debounce"
import fs from "fs"
import path from "path"

const clients = new Set()
const wss = new WebSocketServer({ port: 8081 })

wss.on("connection", (ws) => {
  clients.add(ws)
  ws.on("close", () => clients.delete(ws))
})

const onFileChange = debounce((path) => {
  console.log(`${path} changed, reloading...`)

  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send("reload")
    }
  })
}, 100)

const watcher = chokidar.watch(["./app", "./build"], {
  ignored: /node_modules/,
  persistent: true,
})

watcher.on("change", async (path) => onFileChange(path))

serve({
  fetch(req) {
    const url = new URL(req.url)
    const pathname = url.pathname === "/" ? "app/index.html" : url.pathname
    const filePath = path.join(process.cwd(), pathname)

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return new Response(fs.readFileSync(filePath), {
        headers: { "Content-Type": getContentType(filePath) },
      })
    }

    return new Response("Not Found", { status: 404 })
  },
  port: 8080,
})

console.log(`HTTP server running at http://localhost:8080`)

function getContentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html"
  if (filePath.endsWith(".css")) return "text/css"
  if (filePath.endsWith(".js")) return "application/javascript"
  return "text/plain"
}
