Property Manager
================
This is a JavaScript program that fetches property name, location, etc. from 
a third-party source and displays it in Google Maps. It also displays a grid
containing all the property info allowing users to add and edit the property.

## Installation
1. Update, if required, `mapping.html` and save it in a desired location.
2. Create a subdirectory `js` within that location and save the JavaScript
files within that subdirectory.
3. Change the API URL appropriately in `mapping.js` by changing the value of 
`rootUrl`.

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
