(function () {
    'use strict';

    var app = angular.module("planningLab");
    app.config(config);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider.
          when('/open/:id', {
              templateUrl: 'app/Dashboard/dashboard.html',
              controller: 'PokerRoomCtrl',
              resolve: {
                  userCredentials: userCredentials
              }
          }).
            when('/dashboard', {
                templateUrl: 'app/Dashboard/dashboard.html',
                controller: 'PokerRoomCtrl',
                resolve: {
                    userCredentials: userCredentials
                }
            }).
          otherwise({
              redirectTo: '/dashboard'
          });

        userCredentials.$inject = ["getUser"];
        function userCredentials(getUser) {
            var ret = getUser.getUserInfo();
            return ret;
        }
    }

})()