/**
 * Creates the property grid.
 */

var rootUrl = "http://192.168.56.101:3000";
var marketIdMap = [];

function cancelEditing() {
    getMarkets();
}

function updateProperty(propertyId, name, addr, marketId, latitude, longitude) {
    $.ajax({
        type : "PATCH",
        url : rootUrl + "/properties/" + propertyId,
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
            alert("Error: Could not update property");
            return;
        }
    });
}

function saveProperty(row, propertyId, marketId) {
    var name = $("#nameEdit" + row).val();
    var addr = $("#addrEdit" + row).val();
    var market = $("#submarketIdEdit" + row).val();
    var latitude = $("#latEdit" + row).val();
    var longitude = $("#longEdit" + row).val();

    if (typeof marketIdMap[market] == "undefined") {
        $.ajax({
            type : "POST",
            url : rootUrl + "/markets",
            async : true,
            data : {
                name : market
            },
            success : function(response) {
                marketIdMap[response.name] = response.id;
                updateProperty(propertyId, name, addr, response.id, latitude, 
                        longitude);
            },
            error : function(xhr) {
                alert("Error: Could not add a property");
                return;
            }
        });
    } else {
        updateProperty(propertyId, name, addr, marketIdMap[market], latitude, 
                longitude);
    }
}

function editRecord(row, propertyId, marketId) {
    var $name = $("#name" + row);
    var $addr = $("#addr" + row);
    var $submarket = $("#submarketId" + row);
    var $latitude = $("#lat" + row);
    var $longitude = $("#long" + row);
    var $edit = $("#edit" + row);

    var nameId = "nameEdit" + row;
    var nameVal = $name.text();
    var nameInput = "<input type='text' id='" + nameId + "' value='" + nameVal + "'/>";
    $name.html(nameInput);

    var addrId = "addrEdit" + row;
    var addrVal = $addr.text();
    var addrInput = "<input type='text' id='" + addrId + "' value='" + addrVal + "'/>";
    $addr.html(addrInput);

    var submarketId = "submarketIdEdit" + row;
    var submarketVal = $submarket.text();
    var submarketInput = "<input type='text' id='" + submarketId + "' value='" 
        + submarketVal + "'/>";
    $submarket.html(submarketInput);

    var latId = "latEdit" + row;
    var latVal = $latitude.text();
    var latInput = "<input type='text' id='" + latId + "' value='" + latVal + "'/>";
    $latitude.html(latInput);

    var longId = "longEdit" + row;
    var longVal = $longitude.text();
    var longInput = "<input type='text' id='" + longId + "' value='" + longVal + "'/>";
    $longitude.html(longInput);

    var saveFuncCall = "saveProperty(" + row + ", " + propertyId + ", " 
        + marketId + ")";
    var editLink = "<a onclick='" + saveFuncCall + "'>Save</a>";
    var cancelLink = "<a onclick='cancelEditing()'>Cancel</a>";
    $edit.html(editLink + " | " + cancelLink);
}

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

    addMarket(newMarketId, market, name, addr, latitude, longitude);
}

function displayPropertyTable(markets, lastMarketId, properties) {
    markets.forEach(function(item, index) {
        marketIdMap[item] = index;
    });

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
        var nameId = "name" + i;
        var propName = properties[i].name;
        content += "<tr>";
        content += "<td id='" + nameId + "'>" + propName + "</td>";

        var addrId = "addr" + i;
        var propAddr = properties[i].address1;
        content += "<td id='" + addrId + "'>" + propAddr + "</td>";

        var submarketId = "submarketId" + i;
        var market = markets[properties[i].submarketId];
        content += "<td id='" + submarketId + "'>" + market + "</td>";

        var latId = "lat" + i;
        var propLat = properties[i].latitude;
        content += "<td id='" + latId + "'>" + propLat + "</td>";

        var longId = "long" + i;
        var propLong = properties[i].longitude;
        content += "<td id='" + longId + "'>" + propLong + "</td>";

        var editId = "edit" + i;
        var propId = properties[i].id;
        var marketId = properties[i].submarketId;
        var funcCall = "editRecord(" + i + ", " + propId + ", " + marketId + ")";
        var editLink = "<a onclick='" + funcCall + "'>Edit</a>";
        content += "<td id='" + editId + "'>" + editLink + "</td>";
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
                properties = data.sort(function(a, b) {
                    if (b['name'] > a['name']) {
                        return 1;
                    } else if (b['name'] < a['name']) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                displayPropertyTable(markets, lastMarketId, properties);
            },
            function(data) {
                alert("Error: Could not fetch properties.");
            }
    );
}

function getMarkets() {
    var markets = [];
    var maxId = 0;
    $.get(rootUrl + "/markets").then(
            function(data) {
                data.forEach(function(item, index) {
                    markets[item.id] = item.name;
                    maxId = Math.max(maxId, item.id);
                });
                getProperties(markets, maxId);
            },
            function(data) {
                alert("Error: Could not fetch markets.");
            }
    );
}

$(document).ready(function() {
    getMarkets();
});
