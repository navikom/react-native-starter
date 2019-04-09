import Geocoder from 'react-native-geocoder';
import {Dictionary} from './dictionary';

export const API_KEY = 'HERE SHOULD BE API KEY';

Geocoder.fallbackToGoogle(API_KEY);

const decode = (t, e) => {
  let d = []
  for (let n, o, u = 0, l = 0, r = 0, h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
    a = null, h = 0, i = 0;
    do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
    n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;
    do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
    o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]);
  }

  return d.map(function (t) {
    return {
      latitude: t[0],
      longitude: t[1],
    };
  });
};

const getSteps = items => {
  const steps = [];
  let l = items.length, i = 0;
  while (l--) {
    const item = items[i++];
    steps.push({
      distance: item.distance.value / 1000,
      duration: item.duration.value / 60,
      start: {latitude: item.start_location.lat, longitude: item.start_location.lng},
      end: {latitude: item.end_location.lat, longitude: item.end_location.lng},
      maneuver: item.maneuver,
      instruction: item.html_instructions,
      coordinates: decode(item.polyline.points),
    })
  }
  return steps;
};

export const fetchDirections = async (origin, destination, language = Dictionary.current) => {
  const url = 'https://maps.googleapis.com/maps/api/directions/json';
  origin = `${origin.latitude},${origin.longitude}`;
  destination = `${destination.latitude},${destination.longitude}`;
  const path = `${url}?origin=${origin}&waypoints=&destination=${destination}&key=${API_KEY}&&language=${language}`;
  const response = await fetch(path);
  const json = await response.json();
  if (json.routes.length) {
    const route = json.routes[0];
    return {
      distance: route.legs.reduce((carry, curr) => {
        return carry + curr.distance.value;
      }, 0) / 1000,
      duration: route.legs.reduce((carry, curr) => {
        return carry + curr.duration.value;
      }, 0) / 60,
      coordinates: decode(route.overview_polyline.points),
      steps: getSteps(route.legs[0].steps)
    };
  }
  return null;
};


export const fetchAddressService = async (lt, lg) => {

  let position = {
    lat: lt,
    lng: lg
  };

  return Geocoder.geocodePosition(position)
      .then(response => {
        console.log('geocodePosition', response);
        const results = response.filter(e => e.streetName);

        if (results.length > 0) {
          return results[0];
        } else {
          throw new Error('Address not found');
        }
      }).catch((error) => {
        console.log('geocodePosition', 'Error', error)
        // AppEventsLogger.logEvent("Geocoding Error", {'error': error.toString(), 'position': position})
        throw error;
      })

};