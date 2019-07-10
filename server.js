// APP dependencies
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Global variables
const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

// Construct server with dependency objects
const app = express();
app.use(cors());
const superagent = require('superagent');

// Use express to get location data
app.get('/location', searchToLatLng);

// Performs task of building object from JSON file
function searchToLatLng(request, response) {
  const locationName = request.query.data;
  const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${GEOCODE_API_KEY}`;

  superagent.get(geocodeURL)
    .then(result => {
      let location = new LocationConstructor(result.body);
      location.search_query = locationName;

      response.send(location);
    }).catch(error => {
      console.error(error);
      response.status(500).send('Status 500: Life is hard mang.');
    })
}

// constructor function to build weather objects
function LocationConstructor(geoData) {
  console.log(geoData.results);
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;

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

  return weatherData.daily.data.map(element => WeatherConstructor(element));
}

// constructor function to build weather objects
function WeatherConstructor(element) {
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
