/**
 * Creates the property mapping page.
 */

function initMap() 
{   
    var manhattan = {
        lat : 40.7831,
        lng : -73.9712
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom : 15,
        center : manhattan
    });
    $.get("http://192.168.56.101:3000/properties").then(
            function(data) {
                for (var i = 0; i < data.length; ++i) {
                    console.log("lat: " + data[i].latitude);
                    var location = { 
                            lat : Number(data[i].latitude),
                            lng : Number(data[i].longitude)
                    };
                    
                    var marker = new google.maps.Marker({
                        position : location,
                        map : map
                    });
                }
                
            },
            function(data) {
                console.log("Error: Could not fetch properties.");
            }
    );
}
