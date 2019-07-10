// APP dependencies
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Global vars
const PORT = process.env.PORT;

// Make my server
const app = express();
app.use(cors());

app.get('/location', (request, response) => {
  // response.send('hello world you are on the location path');
  console.log(request.query.data);
  try {
    const locationData = searchToLatLng(request.query.data);
    response.send(locationData);
  } catch (e) {
    response.status(500).send('Status 500: So sorry i broke')
  }
});


function searchToLatLng(locationName) {
  const geoData = require('./data/geo.json');
  const location = {
    search_query: locationName,
    formatted_query: geoData.results[0].formatted_address,
    latitude: geoData.results[0].geometry.location.lat,
    longitude: geoData.results[0].geometry.location.lng,
  }
  return location;
}

app.get('/weather', (request, response) => {
  // response.send('hello world you are on the weather path');
  // console.log(request.query.data);
  try {
    const weatherData = searchWeather();
    console.log(weatherData);
    response.send(weatherData);
  } catch (e) {
    response.status(500).send('Status 500: So sorry i broke')
  }
});

app.use('*', (request, response) => {
  response.send('you got to the wrong place');
})


function searchWeather() {
  const weatherData = require('./data/darksky.json');

  let weatherDetails = [];
  weatherData.daily.data.forEach(element => weatherDetails.push(new WeatherConstructor(element)) );

  return weatherDetails;
}

function WeatherConstructor (element) {
  this.forecast = element.summary,
  this.time = new Date(element.time * 1000).toDateString()
}

// Start the server
app.listen(PORT, () => {
  console.log(`app is up on port ${PORT}`)
})
