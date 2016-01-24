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

            if (frequencyBin[data.time]) {
                for (code in data.codes) {
                    if (frequencyBin[data.time].code) {
                        frequencyBin[data.time].code += data.codes.code;
                    } else {
                        frequencyBin[data.time].code = data.codes.code;
                    }
                }
            } else {
                frequencyBin[data.time] = data.codes;
            }
        } else {
            frequencyBin[data.time]
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

//  {
//      '404':200,
//      '200':213,
//       ...
//  }
var totalStatusCode = {};

//{   'google.com/ahrep':
//        {
//            error: 0.134124,
//            time: 132.122141
//        },
//    'google.com/kfljkdskafdjsal':
//        {
//            error: 0.134124,
//            time: 132.122141
//        }
//}
var resourceTable = {};


//  {
//      '404':200,
//      '200':213,
//       ...
//  }
var frequencyBin = {};


//  {
//      '5':23,
//      '10':42,
//      '15':42,
//       ...
//  }
var reqPerTime = {};