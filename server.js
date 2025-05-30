const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

let publisher = null;
const viewers = new Set();

wss.on('connection', ws => {
  ws.on('message', message => {
    const data = JSON.parse(message);

    if (data.type === 'publisher') {
      publisher = ws;
      ws.role = 'publisher';
      console.log('Publisher connected');
    }

    if (data.type === 'viewer') {
      viewers.add(ws);
      ws.role = 'viewer';
      console.log('Viewer connected');
    }

    // Yayıncıdan izleyicilere sinyal gönder
    if (ws.role === 'publisher') {
      viewers.forEach(viewer => {
        if (viewer.readyState === WebSocket.OPEN) {
          viewer.send(message);
        }
      });
    }

    // İzleyiciden yayıncıya sinyal gönder
    if (ws.role === 'viewer' && publisher && publisher.readyState === WebSocket.OPEN) {
      publisher.send(message);
    }
  });

  ws.on('close', () => {
    if (ws.role === 'publisher') {
      publisher = null;
      console.log('Publisher disconnected');
      // İstersen izleyicilere yayıncı kapandığını bildir
    }
    if (ws.role === 'viewer') {
      viewers.delete(ws);
      console.log('Viewer disconnected');
    }
  });
});

console.log('WebSocket sinyal sunucusu 3000 portunda çalışıyor');
