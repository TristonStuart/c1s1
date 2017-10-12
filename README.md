# C1S1
A Client to Server and Server to Client WebSocket Communicator

By : **Triston Stuart**


--------------------------------------------------------

## Status On Project : 
#### Client : 9% (ESTIMATE)
#### Server : 0% (ESTIMATE)
#### Version : (Alpha unfinished) : C 0.0.1 | S 0

---------------------------------------------------------

## API (CLIENT) : 

### Initialize
----------------------------------------------------------------------------------------------------------------------------------------
Example :
  load({
      server : "127.0.0.1:350/c1s1",
      handle : {
          identify : {
              sucess : function(server){
                  document.getElementById('m').innerHTML += "<br> Sucessfully Identified With Server";
              },
              failure : function(server){
                  document.getElementById('m').innerHTML += "<br> Not Identified With Server :(";
                  document.getElementById('m').innerHTML += "<br> Closing Connection";
                  server.close();
              }
          },
          ping : function(ping){
              document.getElementById('a').innerHTML = "Ping : " + ping;
          }
      }
  });
----------------------------------------------------------------------------------------------------------------------------------------

Here's whats happening : 

You need to load c1s1.js first then your main javascript as your main will initialize c1s1.

You call load, the c1s1 function and need to include and object.

This object will include how to handle identification, pings, connects, disconnects, and will include the server.

----------------------------------------------------------------------------------------------------------------------------------------
