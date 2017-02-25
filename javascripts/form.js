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
        var form = new Form($(this));
        var destination = $(this).find("#destination")[0];
        var startingPoint = $(this).find("#starting-point")[0];
        var options = { types: ["address"], strictBounds: true, bounds: new google.maps.LatLngBounds(new google.maps.LatLng(40.496020, -74.256508), new google.maps.LatLng(40.854265, -73.668605)) };
        new google.maps.places.Autocomplete(destination, options);
        new google.maps.places.Autocomplete(startingPoint, options);
    });
});
