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
                    var location = { 
                            lat : Number(data[i].latitude),
                            lng : Number(data[i].longitude)
                    };
                    
                    var marker = new google.maps.Marker({
                        position : location,
                        map : map
                    });
                    
                    var name = data[i].name;
                    var address = data[i].address1;
                    var marketId = data[i].marketId;
                    
                    var contentStr = "<div id='content'>" + 
                        "Name: " + name + "<br>" + 
                        "Address: " + address + "<br>" + 
                        "Market: " + marketId + "<br>" + 
                        "</div>";
                    
                    var infoWindow = new google.maps.InfoWindow({
                        content: contentStr
                    });
//                    map.setOptions({
//                        gestureHandling: 'auto'
//                    });
                    google.maps.event.addListener(marker, 'click', (function(marker, contentStr) {
                        return function() {
                            infoWindow.setContent(contentStr);
                            infoWindow.open(map, marker);
                            map.setOptions({
                                gestureHandling: 'none'
                            });
                        }
                    })(marker, contentStr));
                    
                    google.maps.event.addListener(infoWindow, 'closeclick', (function(marker, contentStr) {
                        return function() {
                            map.setOptions({
                                gestureHandling: 'auto'
                            });
                        }
                    })(marker, contentStr));
                }
                
            },
            function(data) {
                console.log("Error: Could not fetch properties.");
            }
    );
}