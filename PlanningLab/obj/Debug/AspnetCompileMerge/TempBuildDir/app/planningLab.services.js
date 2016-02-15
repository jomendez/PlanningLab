(function () {
    var app = angular.module("planningLab");

    app.factory('plLocalStorage', function () {

        function setStorage(key, value) {
            if (window.localStorage && !!key && value != 'undefined') {
                localStorage.setItem(key, value);
            }
        }

        function getStorage(key) {
            if (!!key) {
                ret = localStorage.getItem(key);
                return ret;
            }
        }

        return {
            setStorage: setStorage,
            getStorage: getStorage
        }
    });

    app.factory("planningLabService", function () {
        var _this = {};
        _this.numbers = [1, 2, 3, 4, 5];
        _this.tshirt = ["xs", "s", "m", "l", "xl", "xxl"];
        return _this;
    });

    getUser.$inject = ["$http"];
    function getUser($http) {
        this.getUserInfo = function () {
            return $http.get("api/Dashboard/userinfo");
        }

    }

    roomManagement.$inject = ["$http"];
    function roomManagement($http) {
        this.send = function (room) {
            return $http.post("api/Dashboard", JSON.stringify(room.Name));
        }

        this.isOwner = function (room) {
            return $http.get("api/Dashboard/isOwner?roomName=" + room);//, JSON.stringify(room)
        }

        this.getMyRooms = function () {
            return $http.get("api/Dashboard/MyRooms");
        }

        this.getRoomFromId = function (id) {
            return $http.get("api/Dashboard/getRoomFromId?id=" + id);
        }

        this.getRoomFromName = function (name) {
            return $http.get("api/Dashboard/getRoomFromName?name=" + name);
        }
        
    }


    app.service("getUser", getUser);
    app.service("roomManagement", roomManagement);
})();