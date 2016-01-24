var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 4000
    });
var data = {
    load: 100,

    "https://google.com": {
        "GET": [
    "https://mail.google.com/mail/u/0/"
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