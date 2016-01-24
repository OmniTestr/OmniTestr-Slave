var _ = require('underscore');
ws.on('message', function incoming(message) {
    console.log("data received: " + data);
    if (data === "DONE") {
        //DO NEXT SLAVE
    } else {
        data = JSON.parse(data);
        //is final summary of good + bad and time
        if (data.nFailed) {
            var resourceName = data.resource;
            var errorRate = data.nFailed / (data.nFailed + data.nSuccess);
            var averageTime = data.time;
            resourceTable.resourceName = {
                error: errorRate,
                time: averageTime
            };
            //updates the master every 10 sec with status codes
        } else if (data.time % 10 == 0 && data.codes && Object.keys(data.codes).length !== 0) {
            for (code in data) {
                if (frequencyBin[code]) {
                    frequencyBin[code] += data[code];
                } else {
                    frequencyBin[code] = data[code];
                }
            }
            //updates the counter histogram every 5 ms
        } else if (data.time % 5 == 0 && data.count) {
            var strTime = String(data.time);
            if (reqPerTime[strTime]) {
                reqPerTime[strTime] += data[count];
            } else {
                reqPerTime[strTime] = data[count];
            }
        } else {
            for (code in data) {
                if (totalStatusCode[code]) {
                    totalStatusCode[code] += data[code];
                } else {
                    totalStatusCode[code] = data[code];
                }
            }
        }
    }
});

var totalStatusCode = {};
var resourceTable = {};
var frequencyBin = {};
var reqPerTime = {};