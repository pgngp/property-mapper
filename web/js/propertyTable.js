/**
 * Creates the property grid.
 * TODO 
 * (1) When infowindow is open, zoom buttons should dissapear.
 */

var rootUrl = "http://192.168.56.101:3000";
var marketIdMap = [];

/**
 * Cancels editing.
 */
function cancelEditing() {
    getMarkets();
}

/**
 * Updates the given property using an AJAX call.
 * 
 * @param int       propertyId Property ID.
 * @param string    name       Property name.
 * @param string    addr       Property address.
 * @param int       marketId   (Sub) Market ID.
 * @param double    latitude   Property latitude.
 * @param double    longitude  Property longitude.
 */
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
            location.reload();
        },
        error : function(xhr) {
            alert("Error: Could not update property");
            return;
        }
    });
}

/**
 * Saves the edited property.
 * 
 * @param int row           Grid row number.
 * @param int propertyId    Property ID.
 * @param int marketId      Market ID.
 */
function saveProperty(row, propertyId, marketId) {
    var name = $.trim($("#nameEdit" + row).val());
    var addr = $.trim($("#addrEdit" + row).val());
    var market = $.trim($("#submarketIdEdit" + row).val());
    var latitude = $.trim($("#latEdit" + row).val());
    var longitude = $.trim($("#longEdit" + row).val());

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

    // If market doesn't already exist, create it and then update property.
    // Otherwise, just update the property.
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

/**
 * Creates a form to allow editing the property.
 * 
 * @param int row           Grid row number.
 * @param int propertyId    Property ID.
 * @param int marketId      Market ID.
 */
function editRecord(row, propertyId, marketId) {
    var $name = $("#name" + row);
    var $addr = $("#addr" + row);
    var $submarket = $("#submarketId" + row);
    var $latitude = $("#lat" + row);
    var $longitude = $("#long" + row);
    var $edit = $("#edit" + row);

    // Name input
    var nameId = "nameEdit" + row;
    var nameVal = $name.text();
    var nameInput = "<input type='text' id='" + nameId + "' value='" + nameVal + "'/>";
    document.getElementById("name" + row).onclick = null;
    $name.html(nameInput);

    // Address input
    var addrId = "addrEdit" + row;
    var addrVal = $addr.text();
    var addrInput = "<input type='text' id='" + addrId + "' value='" + addrVal + "'/>";
    $addr.html(addrInput);

    // (Sub) Market input
    var submarketId = "submarketIdEdit" + row;
    var submarketVal = $submarket.text();
    var submarketInput = "<input type='text' id='" + submarketId + "' value='" 
        + submarketVal + "'/>";
    $submarket.html(submarketInput);

    // Latitude input
    var latId = "latEdit" + row;
    var latVal = $latitude.text();
    var latInput = "<input type='text' id='" + latId + "' value='" + latVal + "'/>";
    $latitude.html(latInput);

    // Longitude input
    var longId = "longEdit" + row;
    var longVal = $longitude.text();
    var longInput = "<input type='text' id='" + longId + "' value='" + longVal + "'/>";
    $longitude.html(longInput);

    // Save/Cancel buttons
    var saveFuncCall = "saveProperty(" + row + ", " + propertyId + ", " 
        + marketId + ")";
    var editLink = "<a onclick='" + saveFuncCall + "'>Save</a>";
    var cancelLink = "<a onclick='cancelEditing()'>Cancel</a>";
    $edit.html(editLink + " | " + cancelLink);
}

/**
 * Adds the given property to the DB using an AJAX call.
 * 
 * @param int       marketId       Market ID.
 * @param string    name           Property name.
 * @param string    addr           Property address.
 * @param double    latitude       Property latitude.
 * @param double    longitude      Property longitude.
 */
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
            location.reload();
        },
        error : function(xhr) {
            alert("Error: Could not add a property");
            return;
        }
    });
}

/**
 * Adds the given market to the DB using an AJAX call.
 * 
 * @param string market         Market name.
 * @param string name           Property name.
 * @param string addr           Property address.
 * @param double latitude       Property latitude.
 * @param double longitude      Property longitude.
 */
function addMarket(market, name, addr, latitude, longitude) {
    if (typeof marketIdMap[market] == "undefined") {
        $.ajax({
            type : "POST",
            url : rootUrl + "/markets",
            async : true,
            data : {
                name : market
            },
            success : function(response) {
                addProperty(response.id, name, addr, latitude, longitude);
            },
            error : function(xhr) {
                alert("Error: Could not add a property");
                return;
            }
        });
    } else {
        addProperty(marketIdMap[market], name, addr, latitude, longitude);
    }
}

/**
 * Adds a new property/market to the DB.
 */
function addRecord() {
    var name = $.trim($("#propName").val());
    var addr = $.trim($("#propAddr").val());
    var market = $.trim($("#propMarket").val());
    var latitude = $.trim($("#propLat").val());
    var longitude = $.trim($("#propLong").val());

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

    addMarket(market, name, addr, latitude, longitude);
}

/**
 * Displays the property grid.
 * 
 * @param array markets     Array containing market info.
 * @param array properties  Array containing properties info.
 */
function displayPropertyTable(markets, properties) {
    // Create a hashmap containing market name as key and (sub) market ID as 
    // value.
    markets.forEach(function(item, index) {
        marketIdMap[item] = index;
    });

    // Display table
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
        // Property name
        var nameId = "name" + i;
        var propName = properties[i].name;
        var propId = properties[i].id;
        var marketId = properties[i].submarketId;
        var funcCall = "editRecord(" + i + ", " + propId + ", " + marketId + ")";
        content += "<tr>";
        content += "<td id='" + nameId + "' onclick='" + funcCall + "'>" 
            + propName + "</td>";

        // Property address
        var addrId = "addr" + i;
        var propAddr = properties[i].address1;
        content += "<td id='" + addrId + "'>" + propAddr + "</td>";

        // (Sub) market
        var submarketId = "submarketId" + i;
        var market = markets[properties[i].submarketId];
        content += "<td id='" + submarketId + "'>" + market + "</td>";

        // Property latitude
        var latId = "lat" + i;
        var propLat = properties[i].latitude;
        content += "<td id='" + latId + "'>" + propLat + "</td>";

        // Property longitude
        var longId = "long" + i;
        var propLong = properties[i].longitude;
        content += "<td id='" + longId + "'>" + propLong + "</td>";

        // Edit link
        var editId = "edit" + i;
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
    content += "<td><a onclick='addRecord();'>Add</a></td>";
    content += "</tr>";
    content += "</table>";
    $("#grid").html(content);
}

/**
 * Fetches properties and calls the function that will display the grid.
 * 
 * @param array markets     Array containing market info.
 */
function getProperties(markets) {
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
                displayPropertyTable(markets, properties);
            },
            function(data) {
                alert("Error: Could not fetch properties.");
            }
    );
}

/**
 * Fetches market info and call the function that will fetch properties.
 */
function getMarkets() {
    var markets = [];
    $.get(rootUrl + "/markets").then(
            function(data) {
                data.forEach(function(item, index) {
                    markets[item.id] = item.name;
                });
                getProperties(markets);
            },
            function(data) {
                alert("Error: Could not fetch markets.");
            }
    );
}

/**
 * When page is ready, call the function to fetch market info.
 */
$(document).ready(function() {
    getMarkets();
});
