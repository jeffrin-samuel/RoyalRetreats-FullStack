// smtp-test.js
const net = require("net");

const host = "smtp.gmail.com";
const port = 587;

console.log(`Trying to connect to ${host}:${port}...`);

const socket = net.createConnection(port, host, () => {
  console.log(`✅ Connected to ${host}:${port}`);
  socket.end();
});

socket.on("error", (err) => {
  console.error(`❌ Cannot connect to ${host}:${port} ->`, err.message);
});
