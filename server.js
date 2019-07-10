// APP dependencies
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Global variables
const PORT = process.env.PORT;

// Construct server with express
const app = express();
app.use(cors());

// Use express to get location data
app.get('/location', (request, response) => {
  console.log(request.query.data);
  try {
    const locationData = searchToLatLng(request.query.data);
    response.send(locationData);
  } catch (e) {
    response.status(500).send('Status 500: This isn\'t working because your data call is incomplete')
  }
});

// Performs task of building object from JSON file
function searchToLatLng(query) {
  const geoData = require('./data/geo.json');
  const location = new LocationConstructor(geoData);
  location.search_query = query;

  return location;
}

// constructor function to build weather objects
function LocationConstructor (geoData) {
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.elementlongitude = geoData.results[0].geometry.location.lng;

}


// Use express to get weather data
app.get('/weather', (request, response) => {
  try {
    const weatherData = searchWeather();
    response.send(weatherData);
  } catch (e) {
    response.status(500).send('Status 500: So sorry i broke')
  }
});

// Performs task of building object from JSON file
function searchWeather() {
  const weatherData = require('./data/darksky.json');

  let weatherDetails = [];
  weatherData.daily.data.forEach(element => weatherDetails.push(new WeatherConstructor(element)) );

  return weatherDetails;
}

// constructor function to build weather objects
function WeatherConstructor (element) {
  this.forecast = element.summary,
  this.time = new Date(element.time * 1000).toDateString()
}


// error handling
app.use('*', (request, response) => {
  response.send('you got to the wrong place');
})

// Start the server
app.listen(PORT, () => {
  console.log(`app is up on port ${PORT}`)
})
