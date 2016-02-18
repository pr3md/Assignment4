//MODULE
var WeatherApp = angular.module('WeatherApp', ['ngRoute']);

//ROUTES
WeatherApp.config(function($routeProvider){
	$routeProvider
	
	.when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeController'
    })
    
    .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registrationController'
    })
    
    .when('/app', {
        templateUrl: 'views/app.html',
        controller: 'appController'
    })
    
    .when('/user', {
      templateUrl: 'views/userdetails.html',
        controller: 'localStorageController'
    })

});

//CONTROLLERS
WeatherApp.controller('homeController', function($scope) {
  
});

WeatherApp.controller('registrationController', function($scope) {
  $scope.addUser = function() {
    var user = {};
	user.username = document.getElementById("username").value;
	user.password = document.getElementById("password").value;
	user.fullname = document.getElementById("fname").value;
	user.address = document.getElementById("location").value;
	user.email = document.getElementById("email").value;
	
	localStorage.user = JSON.stringify(user); 
	console.log(localStorage.user);
  }
});

WeatherApp.controller('localStorageController', function($scope) {
    
    var init = function() {
        var userString = "";
	
        if(localStorage.user !== undefined) { 
            userString = localStorage.user;

            user = JSON.parse(localStorage.user); 
            console.log(user); 
            document.getElementById("username").innerHTML = user["username"];
            document.getElementById("password").innerHTML = user["password"];
            document.getElementById("email").innerHTML = user["email"];
            document.getElementById("fname").innerHTML = user["fullname"];
            document.getElementById("location").innerHTML = user["address"];
        } 
	
        //console.log(userString);
    };
    init();
});

WeatherApp.controller('appController', function($scope, $http) {
    var map;
    var mapOptions;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });
    var directionsService = new google.maps.DirectionsService();

    var init = function () {
        navigator.geolocation.getCurrentPosition(function (position) {

            var pos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude);

            var mapOptions = {
                zoom: 16,
                center: pos
            };

            map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
        });

            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
     };
    init();
    
    var destination = "";
    var start = "";
    
    $scope.processRequest = function () {
            
        start = document.getElementById('startlocation').value;
        destination = document.getElementById('endlocation').value;
            var request = {
                origin: start,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(map);
                    directionsDisplay.setDirections(response);
                }
                
                $scope.getSWeather();
           
        });
           
    };
    
     $scope.getSWeather = function() {
        $http.get('http://api.openweathermap.org/data/2.5/weather?q='+start+'&APPID=097d1729477350f34a9e56facb2b19f3').success(function(data) {
        console.log(data.main.temp);
        var icon = '<img src="http://openweathermap.org/img/w/'+data.weather[0].icon+'.png">';
        angular.element(document.querySelector('#starting-point-weather')).html(icon+' '+convertF(data.main.temp)+" &deg; F and the "+data.weather[0].description);
            //Fetch Destination Weather
            $scope.getDWeather();
        });
    }
     
    $scope.getDWeather = function() {
        $http.get('http://api.openweathermap.org/data/2.5/weather?q='+destination+'&APPID=097d1729477350f34a9e56facb2b19f3').success(function(data) {
        console.log(data.main.temp);
            
            var icon = '<img src="http://openweathermap.org/img/w/'+data.weather[0].icon+'.png">';
            angular.element(document.querySelector('#destination-point-weather')).html(icon+' '+convertF(data.main.temp)+" &deg; F and the "+data.weather[0].description);
        });    
    }     
    
    google.maps.event.addDomListener(window, 'load', $scope.initialize);
});

//Conversion K TO F Function
function convertF(value) {
    var temp = (value - 273.15) * 1.8 + 32;
    return Math.round(temp * 100)/100;    
    
}