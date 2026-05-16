const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

http.createServer((req, res) => {
  const rawUrl = req.url.split("?")[0];
  const safeUrl = rawUrl === "/" ? "/index.html" : decodeURIComponent(rawUrl);
  const filePath = path.normalize(path.join(root, safeUrl));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "content-type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`Portfolio running at http://127.0.0.1:${port}`);
});
