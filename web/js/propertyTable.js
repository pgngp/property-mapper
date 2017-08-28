/**
 * Creates the property grid.
 */

var rootUrl = "http://192.168.56.101:3000";

function addProperty(marketId, name, addr, latitude, longitude) {
    $.ajax({
        type : "POST",
        url : rootUrl + "/properties",
        async : true,
        data : {
            name : name,
            address1: addr,
            submarketId: marketId,
            latitude: latitude,
            longitude: longitude
        },
        success : function(response) {
            getMarkets();
        },
        error : function(xhr) {
            alert("Error: Could not add a property");
            return;
        }
    });
}

function addMarket(marketId, market, name, addr, latitude, longitude) {
    $.ajax({
        type : "POST",
        url : rootUrl + "/markets",
        async : true,
        data : {
            id : marketId,
            name : market
        },
        success : function(response) {
            addProperty(marketId, name, addr, latitude, longitude);
        },
        error : function(xhr) {
            alert("Error: Could not add a property");
            return;
        }
    });
}

function addRecord(lastMarketId) {
    console.log("lastmarketid: " + lastMarketId);
    var name = $.trim($("#propName").val());
    var addr = $.trim($("#propAddr").val());
    var market = $.trim($("#propMarket").val());
    var latitude = $.trim($("#propLat").val());
    var longitude = $.trim($("#propLong").val());
    var newMarketId = lastMarketId + 1;
    
    // Validate input
    var message = "";
    if (name == "") {
        message += "- Property name cannot be empty\n";
    }
    if (addr == "") {
        message += "- Property address cannot be empty\n";
    }
    if (market == "") {
        message += "- Property market name cannot be empty\n";
    }
    if (latitude == "") {
        message += "- Property latitude cannot be empty\n";
    }
    if (longitude == "") {
        message += "- Property longitude cannot be empty\n";
    }
    if (message != "") {
        message = "Following errors occurred:\n" + message;
        alert(message);
        return;
    }
    
    console.log("here");
    addMarket(newMarketId, market, name, addr, latitude, longitude);
}

function displayPropertyTable(markets, lastMarketId, properties) {
    content = "<table>";
    content += "<tr>";
    content += "<th>Name</th>";
    content += "<th>Address</th>";
    content += "<th>Market</th>";
    content += "<th>Latitude</th>";
    content += "<th>Longitude</th>";
    content += "<th>Edit</th>";
    content += "</tr>";
    for (var i = 0; i < properties.length; ++i) {
        content += "<tr>";
        content += "<td>" + properties[i].name + "</td>";
        content += "<td>" + properties[i].address1 + "</td>";
        content += "<td>" + markets[properties[i].submarketId] + "</td>";
        content += "<td>" + properties[i].latitude + "</td>";
        content += "<td>" + properties[i].longitude + "</td>";
        content += "<td><a>Edit</a></td>";
        content += "</tr>";
    }
    content += "<tr>";
    content += "<td><input type='text' id='propName'/></td>";
    content += "<td><input type='text' id='propAddr'/></td>";
    content += "<td><input type='text' id='propMarket'/></td>";
    content += "<td><input type='text' id='propLat'/></td>";
    content += "<td><input type='text' id='propLong'/></td>";
    content += "<td><a onclick='addRecord(" + lastMarketId + ");'>Add</a></td>";
    content += "</tr>";
    content += "</table>";
    $("#grid").html(content);
}

function getProperties(markets, lastMarketId) {
    var properties = null;
    $.get(rootUrl + "/properties").then(
            function(data) {
                properties = data;
                displayPropertyTable(markets, lastMarketId, properties);
            },
            function(data) {
                console.log("Error: Could not fetch properties.");
            }
    );
}

function getMarkets() {
    var markets = [];
    var maxId = 0;
    $.get(rootUrl + "/markets").then(
            function(data) {
                for (var i = 0; i < data.length; ++i) {
                    markets[data[i].id] = data[i].name;
                    maxId = Math.max(maxId, data[i].id);
                }
                getProperties(markets, maxId);
            },
            function(data) {
                console.log("Error: Could not fetch markets.")
            }
    );
}

$(document).ready(function() {
    getMarkets();
});
