// Notes :
// Added some logging + A logging system.
// Comments will be removed in official release
// Do not use source code in applications, use obbfuscated version to help prevent tampering. (Also obfuscate your query)

// Load, main function, query is how to handle everything, check api file (/api/query.txt)
function load(query){

    // Non-Important Variables (Help default processes)
    let isredirecting = false;
    let redirectID = {};


    // Logging (FINALLY!) | Note : Logs wont be explained
    let logs = {}; // Store Logs
    let sst = new Date(); // System Start Time
    function getLogTime(){

        let a = new Date(); // Get Current Date
        let b = a.getTime(); // Get Current Milliseconds since 1970
        let c = sst.getTime(); // Get sst Milliseconds since 1970

        return String(b - c); // Accurate Logging Time

    }
    function log(x){

        if (query.doLogs){ // Should Client Log?

            logs[getLogTime()] = x; // Log

        }

    }


    // Initialize Query Processes
    if (query.initialize){

        query.initialize();

    }



    console.log('C1S1 | Client - Side Javascript to Server Communicator') // Yay! it works
    console.log('C1S1 | Client Version : 0.1.0') // May add a version checker in the future
    log('Client Loadded, Version : 0.1.0');

    // Generate a ccid, read about the ccids in (/api/ccid.txt)
    function generateCCID() {

        log('Generating CCID')
        var d = new Date().getTime();

        var ccid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });

        log('CCID : ' + ccid);
        return ccid;

    }

    // Set ccid
    log('Calling to generated CCID');
    let ccid = generateCCID();

    // Set server
    log('Calling to connect to server : ws://' + quer.server);
    let server = new WebSocket('ws://' + query.server);

    // Send ip and ccid
    function identify(){

        if (redirecting){

            log('Identifying with Redirection')

            let packet = {

                type : "redirect",
                ccid : ccid,
                id : redirectID

            }

            server.send(JSON.stringify(packet))

        }else {

            log('Identifying...');
            // Basicly an object that the server can read
            let packet = {

                type : "identify",
                ccid : ccid

            }
            server.send(JSON.stringify(packet)) // Send packet

        }

    }

    server.onmessage = function(e){ // Handle Messages recived from server

        log('Client recieved a message.')
        let data = JSON.parse(e.data); // Get the data into a readable format (Object)
        if (data.event) { // Make sure the data exists, idk why it wouldn't

            log('Message Event : ' + data.event);
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

                isredirecting = true;
                redirectID = data.event.id;

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
                    alert("FATAL ERROR | C1S1 Code : A1 | Message Dev : " + query.dev.contact) //Fatal Error, will add handle, will add error code lookup too
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

        log('Client connected to server')
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

        log('Disconnecting from server')
        // Check if redirecting...
        if (isredirecting){

            log('Disconnect issued as a redirect.')
            clearInterval(constPing);
            // Gives room for future improvements

        }else {

            if (query.handle.close){ // If query handle, handle

                query.handle.close(server);

            }
            console.log('C1S1 | Stopping Processes, Conenction Closed'); //Logs
            clearInterval(constPing); // Stop constant pinging of server

        }

    }

}
