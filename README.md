Property Manager
================
This is a JavaScript program that fetches property name, location, etc. in 
JSON format from a third-party source and displays it in Google Maps. It also 
displays a grid containing all the property info allowing users to add and 
edit the property.

## Input
The market and property input is provided by third-party APIs 
`<IP_ADDR>:<PORT>/markets` and `<IP_ADDR>:<PORT>/properties`. 

`<IP_ADDR>:<PORT>/markets` provides market info in JSON format:
```
[
  {
    "name": "Downtown",
    "id": 47
  },
  {
    "name": "Midtown",
    "id": 48
  }
  ...
]
```

`<IP_ADDR>:<PORT>/properties` provides market info in JSON format:
```
[
  {
    "name": "test14",
    "address1": "test14",
    "submarketId": 34,
    "latitude": 40.7630775,
    "longitude": -73.9940752,
    "id": 16
  },
  {
    "name": "test15",
    "address1": "test15addr",
    "submarketId": 22,
    "latitude": 40.7730775,
    "longitude": -73.9540752,
    "id": 17
  },
  ...
]
```

## Simple (minimum) installation
1. Update, if required, `mapping.html` and save it in a desired location.
2. Create a subdirectory `js` within that location and save the JavaScript
files within that subdirectory.
3. Change the API URL appropriately in `mapping.js` by changing the value of 
`rootUrl`.

## Installation using Symfony
1. This program has been developed on `Ubuntu 16.04` using `PHP 7`, `Symfony 3.3.6`, 
and `Composer 1.0.0-beta2`. Before installing this program, make sure you install 
the appropriate versions of PHP, Symfony, and Composer.
2. `git clone` the code into the root web directory.
3. Change to the project directory and then run `composer install` to install 
dependencies.
4. Update the value of `rootUrl` in `mapping.js` appropriately. This URL is 
the URL that provides APIs for markets and properties.
4. Start the built-in PHP server by running `php bin/console server:start <IP_ADDRESS>:<PORT>`.
5. In a web browser, go to `<IP_ADDRESS>:<PORT>/mapping` to access the app.

## Usage
1. Go to the URL of this application. You will see a Google map centered on 
Manhattan and showing a pin for each property. Clicking on a pin shows the 
property info. During this time the map navigation will be disabled. Closing 
the infobox will enable the navigation again.
2. A grid containing the property info is displayed below the Google map. The 
rows are sorted by property name in descending order. 
3. If you click on the name field or on the `Edit` link, the row will change 
into an editable form. Once you make the changes, you can save them by clicking 
on `Save`. If you don't want to save changes, click on `Cancel`. After changes 
are saved, the grid and map are updated.
4. You can add a new property by filling the form in the last row and clicking
on `Add` link. The new property will be displayed in the Google map and in the 
grid.
