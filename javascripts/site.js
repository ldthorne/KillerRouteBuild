'use strict';

var initMap = function initMap() {
  var mapElement = document.getElementById('map');
  var balticCoords = {
    lat: 40.680726,
    lng: -73.981267
  };
  var mapOpts = {
    center: balticCoords,
    scrollwheel: false,
    mapTypeControl: false,
    zoom: 15
  };
  var map = new google.maps.Map(mapElement, mapOpts);
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
            }).done(this.calculateCoords).fail(function (err) {
                console.error(err);
            });
        }
    }, {
        key: "calculateCoords",
        value: function calculateCoords(response) {
            console.log(response);
            var points = [{ lat: response.destinationCoords.lat, lng: response.startingCoords.lng }, { lat: response.startingCoords.lat, lng: response.destinationCoords.lng }, response.startingCoords, response.destinationCoords];
            // $.get()
        }
    }, {
        key: "findRelevantCrimes",
        value: function findRelevantCrimes(crimes) {
            var map = crimes.map(function (elem) {
                // return
            });
        }
    }]);

    return Form;
})();

$(document).ready(function () {
    $('#sidebar').find('form').each(function () {
        new Form($(this));
    });
});
// This is where it all goes :)


;
