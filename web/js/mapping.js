/**
 * Creates the property mapping page.
 */

/**
 * This is the URL that provides the API for properties and markets.
 */
var rootUrl = "http://192.168.56.101:3000";

/**
 * Initializes the Google map.
 */
function initMap() {
    // Manhattan coordinates
    var manhattan = {
        lat : 40.7831,
        lng : -73.9712
    };
    
    // Instantiate a new map
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom : 12,
        center : manhattan
    });
    
    // Fetch market info
    var markets = [];
    $.get(rootUrl + "/markets").then(
            function(data) {
                for (var i = 0; i < data.length; ++i) {
                    markets[data[i].id] = data[i].name;
                }
            },
            function(data) {
                console.log("Error: Could not fetch markets.")
            }
    );

    // Fetch properties and display each property in the map
    $.get(rootUrl + "/properties").then(
            function(data) {
                for (var i = 0; i < data.length; ++i) {
                    // Property location
                    var location = { 
                            lat : Number(data[i].latitude),
                            lng : Number(data[i].longitude)
                    };

                    // Marker
                    var marker = new google.maps.Marker({
                        position : location,
                        map : map
                    });

                    // Content string
                    var name = data[i].name;
                    var address = data[i].address1;
                    var market = markets[data[i].submarketId];
                    var contentStr = "<div id='content'>" +
                        "Name: " + name + "<br>" +
                        "Address: " + address + "<br>" +
                        "Market: " + market + "<br>" +
                        "</div>";

                    // Info window
                    var infoWindow = new google.maps.InfoWindow({
                        content: contentStr
                    });
                    google.maps.event.addListener(marker, 'click', (function(marker, contentStr) {
                        return function() {
                            infoWindow.setContent(contentStr);
                            infoWindow.open(map, marker);
                            map.setOptions({
                                gestureHandling: 'none',
                                disableDefaultUI: true
                            });
                        }
                    })(marker, contentStr));
                    google.maps.event.addListener(infoWindow, 'closeclick', (function() {
                        return function() {
                            map.setOptions({
                                gestureHandling: 'auto',
                                disableDefaultUI: false
                            });
                        }
                    })(marker, contentStr));
                }
            },
            function(data) {
                alert("Error: Could not fetch properties.");
                return;
            }
    );
}

