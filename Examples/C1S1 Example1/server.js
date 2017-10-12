var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var path = require('path')

app.get('/c1s1', function(req, res){
    res.sendFile(path.join(__dirname, './Site', 'c1s1.html'))
});
app.get('/c1s1.js', function(req, res){
    res.sendFile(path.join(__dirname, './Site', 'c1s1.js'))
});
app.get('/main.js', function(req, res){
    res.sendFile(path.join(__dirname, './Site', 'main.js'))
});


let clients = {
    list : [],
    client : []
}

app.ws('/c1s1', function(ws, req) {
    ws.on('message', function(msg) {
        var info = JSON.parse(msg);
        if (info.type == "identify"){
            clients.list.push([info.ip, info.ccid]);
            clients.client.push({ping : 0, packets : {processing : 0, waiting : 0, delivered : 0, recieved : 0}});
            console.log('New Client, Client CCID : ' + info.ccid);
        }else if (info.type == "ping"){
            var time = Date.now();
            var packet = {
                event : "pong",
                time : (time - info.time)
            }
            ws.send(JSON.stringify(packet))
            console.log('Recived Ping')
        }
    });
});

app.listen(350)