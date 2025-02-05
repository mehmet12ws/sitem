const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let players = [];

wss.on('connection', (ws) => {
    console.log('Yeni bir oyuncu bağlandı!');

    // Yeni oyuncuyu ekleyin
    players.push(ws);

    // Bağlantıdaki her mesajı dinleyin
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        // Diğer oyunculara veri gönder
        players.forEach(player => {
            if (player !== ws) {
                player.send(message);
            }
        });
    });

    // Bağlantı kapandığında oyuncuyu listeden çıkarın
    ws.on('close', () => {
        players = players.filter(player => player !== ws);
        console.log('Bir oyuncu ayrıldı!');
    });
});

console.log('Sunucu 8080 portunda çalışıyor...');
