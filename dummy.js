var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 4000
    });
var data = {
    load: 500,

    "https://google.com": {
        "GET": [
    "https://www.google.com"
    ]
    }

};

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        console.log("message received: " + message);
    });

    console.log("connection established!");
    ws.send(JSON.stringify(data));
});