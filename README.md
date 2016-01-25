# OmniTestr-Slave

We had to create the socket between the master and slave for this model. The master will send a request through a websocket to a slave with data in the following format:

<img src = "https://raw.githubusercontent.com/OmniTestr/OmntiTestr-Crawler/master/demo.jpg">

Each slave will handle one endpoint at a time, and will run the request as many times as the load specifies. Using node's <a href="https://www.npmjs.com/package/request">request package</a>, we make a large amount of calls to the request easily.

```
for (var i = 1; i <= load; i++) {
  request({
    uri: data[k]["GET"][0], 
    method: "GET", 
    time: true 
  }, callback); 
}
```
Our callback function returns a JSON data structure with both the time the request took and the status code. We need to keep track of all the times for the load requests, and so we have a global variable that starts out like:
```
var indiv = {
    resource: "",
    time: 0,
    nFailed: 0,
    nSuccess: 0
};
```
This gets updates constantly with a function to just aggregate the data. After all the data has been processed, everything is sent through node's <a href ="https://www.npmjs.com/package/ws">ws package</a> back to the master.<br>There are also various function that send updates to the master for real-time updates on the web app.
```
function timer() {
    setInterval(function () {
        ws.send(JSON.stringify({
            time: counter += 5,
            count: tracker
        }));
        tracker = 0;
    }, 5);
}
```
This function sends how many requests are made every 5 milliseconds to the master. <br>
Incase the slaves get blocked from sending too many requests, we made it so the slaves end themselves after 10 seconds of no response.
<hr>
There should be 5 of these slaves running at any given time.
