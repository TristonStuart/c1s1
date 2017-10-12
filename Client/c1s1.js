// Will add comments to make more readable soon

let ping = 0;

function load(query){
    console.log('C1S1 | Client - Side Javascript to Server Communicator')
    console.log('C1S1 | Client Version : 1.0.1')
    
    function generateCCID() {
        var d = new Date().getTime();
        var ccid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return ccid;
    }
    
    let ccid = generateCCID();
    
    let ip;
    
    $.getJSON('//jsonip.com/?callback=?', function(data) {
        ip = data.ip
    });
    
    let server = new WebSocket('ws://' + query.server);
    
    console.log('C1S1 | Establishing connection to server...')
    console.log('C1S1 | Sending Beggining Packets to server in 1 second')
    
    function identify(){
        let packet = {
            type : "identify",
            ip : ip,
            ccid : ccid
        }
        
        if (server.readyState == "OPEN"){
            server.send(JSON.stringify(packet))
            
            console.log('C1S1 | Sent IP and CCID to server, waiting for a resposne')
        }else if (server.readyState == "CONNECTING"){
            console.log('C1S1 | Retrying Identification in 1 second')
            setTimeout(identify, 1000)
        }else if (server.readyState == "CLOSING"){
            console.log('C1S1 | Can not identify, connection cloasing.')
        }
        
    }
    
    setTimeout(identify, 1000);
    
    server.onmessage = function(e){
        let data = JSON.parse(e.data);
        if (data.event) {
            if (data.event == "identify"){
                if (data.try == "success"){
                    console.log('C1S1 | Client is verified by server');
                    if (data.else){
                        console.log('C1S1 | ' + data.else)
                    }
                    if (query.handle.identify.success){
                        query.handle.identify.sucess(server);
                    }
                }else{
                    console.log('C1S1 | Error server cannot verify client, check reason')
                    console.log('C1S1 ||| SERVER INFOR PACKET ||| =-= ' + data.reason);
                    if (query.handle.identify.failure){
                        query.handle.identify.failure(server, data.reason);
                    }
                }
            }else if (data.event == "packet"){
                query.handle.packet(data.packet, server)
            }else if (data.event == "AD"){
                query.handle.appdata(data.appdata, server)
            }else if (data.event == "redirect"){
                if (query.event.redirect == "c1s1"){
                    
                }else if (query.event.redirect == "c1s1 & query"){
                    
                }else if (query.event.redirect == "query"){
                    
                }else {
                    alert("FATAL ERROR | C1S1 Code : X0222 | Message Dev : " + query.dev.contact)
                }
            }else if (data.event == "pong"){
                ping = data.time;
                if (query.handle.ping){
                    query.handle.ping(ping);
                }
            }
        }
    }
    
    let constPing;
    
    server.onopen = function(){
        console.log('C1S1 | Connected to server');
        if (query.handle.connect){
            query.handle.connect(server);
        }
        constPing = setInterval(function(){server.send(JSON.stringify({type : "ping", time : Date.now()}))}, 1000)
    }
    
    server.onclose = function(){
        if (query.handle.close){
            query.handle.close(server);
        }
        console.log('C1S1 | Stopping Processes, Conenction Closed');
        clearInterval(constPing);
        console.log('C1S1 | Terminated Pinging');
    }
    
    
}
