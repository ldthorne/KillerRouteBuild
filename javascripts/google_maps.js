'use strict';

var initMap = function initMap() {
  var mapElement = document.getElementById('map');
  var balticCoords = {
    lat: 40.680726,
    lng: -73.981267
  };
  var mapOpts = {
    center: balticCoords,
    mapTypeControl: false,
    zoom: 15
  };
  var map = new google.maps.Map(mapElement, mapOpts);
  window.map = map;
  getLocation(map);
};

function getLocation(map) {
  navigator.geolocation.getCurrentPosition(function (location) {
    recenterMap(location, map);
  });
}

function recenterMap(location, map) {
  var lat = location.coords.latitude;
  var lng = location.coords.longitude;
  map.setCenter(new google.maps.LatLng(lat, lng));
};
