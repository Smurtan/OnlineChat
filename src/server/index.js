const WebSocketServer = new require('ws');

const webSocketServer = new WebSocketServer.Server({port: 8080});

webSocketServer.on('connection', (ws) => {

})
