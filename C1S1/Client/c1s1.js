// Notes :
// Will add comments to make more readable soon
// Console.logs may be removed in the next version although usefull for debuging (may add debug property in query that will allow or dissallow logs)
// Comments will be removed in official release
// Do not use source code in applications, use obbfuscated version to help prevent tampering. (Also obfuscate your query)

// Load, main function, query is how to handle everything, check api file (/api/query.txt)
function load(query){

    console.log('C1S1 | Client - Side Javascript to Server Communicator') // Yay! it works
    console.log('C1S1 | Client Version : 1.0.2') // May add a version checker in the future

    // Generate a ccid, read about the ccids in (/api/ccid.txt)
    function generateCCID() {

        var d = new Date().getTime();

        var ccid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });


        return ccid;

    }

    // Set ccid
    let ccid = generateCCID();

    // Set server
    let server = new WebSocket('ws://' + query.server);

    // Send ip and ccid
    function identify(){

        // Basicly an object that the server can read
        let packet = {

            type : "identify",
            ccid : ccid

        }
        server.send(JSON.stringify(packet)) // Send packet

    }

    server.onmessage = function(e){ // Handle Messages recived from server

        let data = JSON.parse(e.data); // Get the data into a readable format (Object)
        if (data.event) { // Make sure the data exists, idk why it wouldn't

            if (data.event == "identify"){ // If its identify, process

                if (data.try == "success"){ // If identification successfull

                    if (query.handle.identify.success){// query handle if exists

                        query.handle.identify.success(server);

                    }

                }else{

                    if (query.handle.identify.failure){// query handle if exists

                        query.handle.identify.failure(server, data.reason);

                    }

                }
            }else if (data.event == "packet"){// If its a packet, handle by query

                query.handle.packet(data.packet, server)

            }else if (data.event == "redirect"){// Redirects, not finished, check (/api/redirect.txt)

                if (query.event.redirect == "c1s1"){// Handle by c1s1

                    server.close();
                    server = new WebSocket("ws://" + data.redirect.to)

                }else if (query.event.redirect == "c1s1 & query"){// Handle by c1s1 and query

                    query.handle.redirect(server, data.redirect)
                    server.close();
                    server = new WebSocket("ws://" + data.redirect.to)

                }else if (query.event.redirect == "query"){// Handle by just query

                    query.handle.redirect(server, data.redirect)

                }else {
                    alert("FATAL ERROR | C1S1 Code : X0222 | Message Dev : " + query.dev.contact) //Fatal Error, will add handle, will add error code lookup too
                }

            }else if (data.event == "pong"){// Recieve a pong

                ping = data.time; // get the time to upload data to server
                if (query.handle.ping){ // If ping hanndle in query, handle it
                    query.handle.ping(ping);

                }

            }

        }
    }

    let constPing; // Constantly ping server

    server.onopen = function(){ // When server and client connect

        console.log('C1S1 | Connected to server'); // Logs
        if (query.handle.connect){ // If query handle, handle it

            query.handle.connect(server);

        }
        // Set Interval to ping every second
        constPing = setInterval(function(){server.send(JSON.stringify({type : "ping", time : Date.now()}))}, 1000);
        // Run identify
        identify();

    }

    server.onclose = function(){ // When server and client disconnect

        if (query.handle.close){ // If query handle, handle

            query.handle.close(server);

        }
        console.log('C1S1 | Stopping Processes, Conenction Closed'); //Logs
        clearInterval(constPing); // Stop constant pinging of server

    }

}
