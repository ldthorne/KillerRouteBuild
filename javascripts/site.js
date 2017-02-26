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
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Form = (function () {
    function Form($form) {
        _classCallCheck(this, Form);

        this.$form = $form;
        this.$map = $('#map');
        this.attachHandler();
    }

    _createClass(Form, [{
        key: "attachHandler",
        value: function attachHandler() {
            var self = this;
            this.$form.submit(function (e) {
                e.preventDefault();
                self.submitForm();
            });
        }
    }, {
        key: "submitForm",
        value: function submitForm() {
            var _this = this;

            var locations = {
                destination: this.$form.find("#destination").val(),
                startingPoint: this.$form.find("#starting-point").val()
            };
            if (!locations.destination || !locations.startingPoint) {
                alert('enter shit, dumbass');
            }
            $.ajax({
                url: 'https://infinite-ridge-11745.herokuapp.com/geocode',
                method: 'POST',
                data: JSON.stringify(locations),
                dataType: 'json'
            }).done(function (response) {
                _this.calculateCoords(response);
            }).fail(function (err) {
                console.error(err);
            });
        }
    }, {
        key: "calculateCoords",
        value: function calculateCoords(response) {
            var _this2 = this;

            console.log(response);
            this.startingCoords = response.startingCoords;
            this.destinationCoords = response.destinationCoords;
            var points = [{ lat: response.destinationCoords.lat, lng: response.startingCoords.lng }, { lat: response.startingCoords.lat, lng: response.destinationCoords.lng }, response.startingCoords, response.destinationCoords];
            $.ajax({
                url: 'http://62.220.148.175:5000/crime/api',
                method: 'POST',
                data: JSON.stringify(points),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }).then(function (crimes) {
                console.log(crimes);
                _this2.findRelevantCrimes(crimes);
            })["catch"](function (err) {
                console.error(err);
            });
            // $.get()
        }
    }, {
        key: "findRelevantCrimes",
        value: function findRelevantCrimes(crimes) {
            var _this3 = this;

            crimes = crimes.points.map(function (elem) {
                return {
                    lat: elem[0],
                    lng: elem[1]
                };
            });
            var closebyCrimes = crimes.filter(function (elem) {
                var angleDeg = Math.atan2(elem.lat - _this3.startingCoords.lat, elem.lng - _this3.startingCoords.lng) * 180 / Math.PI;
                return angleDeg >= 20;
            });

            if (closebyCrimes.length > 3) {
                console.log('lotta crims heres');
                closebyCrimes = closebyCrimes.slice(0, 3);
            }
            this.getDirections(closebyCrimes);
        }
    }, {
        key: "getDirections",
        value: function getDirections(crimes) {
            var origin = "origin=" + this.startingCoords.lat + "%2C" + this.startingCoords.lng;
            var destination = "destination=" + this.destinationCoords.lat + "%2C" + this.destinationCoords.lng;
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true
            });
            directionsDisplay.setMap(window.map);
            var waypoints = crimes.map(function (crime) {
                return {
                    location: crime,
                    stopover: true
                };
            });

            console.log(waypoints.length);
            directionsService.route({
                origin: this.startingCoords,
                destination: this.destinationCoords,
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, function (res, status) {
                console.log(res, status);
                directionsDisplay.setDirections(res);
            });
        }
    }]);

    return Form;
})();

$(document).ready(function () {
    $('#sidebar').find('form').each(function () {
        var form = new Form($(this));
        var destination = $(this).find("#destination")[0];
        var startingPoint = $(this).find("#starting-point")[0];
        var options = { types: ["address"], strictBounds: true, bounds: new google.maps.LatLngBounds(new google.maps.LatLng(40.496020, -74.256508), new google.maps.LatLng(40.854265, -73.668605)) };
        new google.maps.places.Autocomplete(destination, options);
        new google.maps.places.Autocomplete(startingPoint, options);
    });
});
// This is where it all goes :)


;
