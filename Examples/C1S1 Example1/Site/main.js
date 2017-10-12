load({
    server : "72.223.112.19:350/c1s1",
    handle : {
        identify : {
            success : function(server){
                document.getElementById('m').innerHTML += "<br> Sucessfully Identified With Server"
            },
            failure : function(server){
                document.getElementById('m').innerHTML += "<br> Not Identified With Server :("
                document.getElementById('m').innerHTML += "<br> Closing Connection"
                server.close();
            }
        },
        ping : function(ping){
            document.getElementById('a').innerHTML = "Ping : " + ping
        }
    }
})
