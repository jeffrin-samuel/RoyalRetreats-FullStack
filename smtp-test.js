// smtp-test.js
const net = require("net");

const host = "smtp.gmail.com";
const port = 587;

async function testSMTP() {
  return new Promise((resolve, reject) => {
    console.log(`Trying to connect to ${host}:${port}...`);

    const socket = net.createConnection(port, host, () => {
      console.log(`✅ Connected to ${host}:${port}`);
      socket.end();
      resolve("✅ Connected");
    });

    socket.on("error", (err) => {
      console.error(`❌ Cannot connect to ${host}:${port} ->`, err.message);
      reject(err);
    });
  });
}

module.exports = { testSMTP };
