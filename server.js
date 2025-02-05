const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('Yeni bir kullanıcı bağlandı!');
  
  ws.on('message', (message) => {
    // Diğer oyunculara mesajı ilet
    clients.forEach(client => {
      if (client !== ws) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Bir kullanıcı ayrıldı!');
  });
});
