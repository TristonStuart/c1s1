load({
    server : "72.223.112.19:350/c1s1",
    game : {
        world : "",
        cell : ""
    },
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
        },
        packet : function(data, server){
            if (data.type = "new"){
                if (data.dat = "world"){
                    this.game.world = data.data;
                    document.getElementById('m').innerHTML += "<br> Generating Game..."
                }else if (data.dat = "cell"){

                }
            }
        }
    }
})
