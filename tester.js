var request = require('request');
var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:4000');

var indiv = {
    resource: "",
    time: 0,
    nFailed: 0,
    nSuccess: 0
};
var load = 0;
var tracker = 0;
var first = true;
var canEnd = false;
//need to edit websocket address

var statC = {};
var tempC = {};
ws.on('open', function open() {
    ws.send('something');
    console.log("connection established");
});

ws.on('message', function (data, flags) {

    console.log("message received");
    if (data) {
        console.log(data);
        data = JSON.parse(data);
        load = data['load'];
        for (k in data) {
            if (k !== "load") {
                console.log("data[k]");
                console.log(data[k]);
                indiv.resource = data[k]["GET"][0];
                for (var i = 1; i <= load; i++) {
                    request({
                        uri: data[k]["GET"][0],
                        method: "GET",
                        time: true
                    }, callback);
                }
            }

        };
    }

});



// flags.binary will be set if a binary data is received. 
// flags.masked will be set if the data was masked. 

function callback(error, response, body) {
    if (!error) {
        var results = {
            time: response.elapsedTime,
            status: response.statusCode
        };
        handleIndiv(results);
        console.log("Reults");
        console.log(results);
    } else {

    }
};


function handleIndiv(ret) {
    tracker++;
    if (first) {
        timer();
        timer2();
        first = false;
    }

    histCounter = ret.time;
    indiv.time = ret.time;
    if (ret.status >= 400) {
        indiv.nFailed++;
    } else {
        indiv.nSuccess++;
    }
    if (statC[String(ret.status)]) {
        statC[String(ret.status)]++;
    } else {
        statC[String(ret.status)] = 1;
    }
    if (tempC[String(ret.status)]) {
        tempC[String(ret.status)]++;
    } else {
        tempC[String(ret.status)] = 1;
    }
    console.log("updated indiv");
    console.log(indiv);
    if (indiv.nFailed + indiv.nSuccess === load) {
        canEnd = true;

        indiv.time = ret.time / load;
        sender();
    }
}

function sender() {
    ws.send(JSON.stringify(statC));
    ws.send(JSON.stringify(indiv));
    ws.send("DONE");
    ws.close();
    resetIndiv();

}


function resetIndiv() {
    indiv = {
        resource: "",
        time: 0,
        nFailed: 0,
        nSuccess: 0
    };
}

var counter = 0;
var counterTen = 0;

function timer() {
    setInterval(function () {
        var temp = tracker;
        tracker = 0;
        //        ws.send(JSON.stringify({
        //            time: counter += 5,
        //            count: temp
        //        }));
    }, 5);
}

function timer2() {
    setInterval(function () {
        if (Object.keys(tempC).length === 0) {
            sender();
        } else {
            var temp = tempC;
            tempC = {};
            ws.send(JSON.stringify({
                time: counterTen += 10,
                codes: temp
            }));
        }
    }, 10000);
}