var PlanningLab;
(function (PlanningLab) {
	var app = angular.module("planningLab");

	var PokerRoomCtrl = (function () {
	    PokerRoomCtrl.$inject = ['userCredentials', '$scope', '$location', '$cookies', 'planningLabService', 'plLocalStorage', 'getUser', 'roomManagement', '$routeParams', '$timeout'];
	    function PokerRoomCtrl(userCredentials, $scope, $location, $cookies, planningLabService, plLocalStorage, getUser, roomManagement, $routeParams, $timeout) {
			var _this = this;
			this.$scope = $scope;
			this.$timeout = $timeout;
			this.roomManagement = roomManagement;
			this.$location = $location;
			this.plLocalStorage = plLocalStorage;
			this.$cookies = $cookies;
			this.planningLabService = planningLabService;
			this._poker = $.connection.poker;
			var that = this;
			$scope.myCard = {};

	        (function () {
			    var credentials = userCredentials.data;
			    $scope.me = $scope.me || {};
			    $scope.me.Name = credentials.Name;
			    $cookies.userName = credentials.Name
			    $scope.me.Email = credentials.Email;
			    $cookies.userEmail = credentials.Email;
			})();
			
			$(window).bind("beforeunload", function () {
			    $scope.removeRoomUser();
			});

			$scope.$on('$routeChangeStart', function (next, current) {
			    $scope.removeRoomUser();
			});
			
			$scope.planningMethod = planningLabService.numbers;

			roomManagement.getMyRooms().then(function (request) {
			    $scope.myRooms = request.data;
			});


			var param = $routeParams;
			if (!!param.id) {
			    roomManagement.getRoomFromId(param.id).then(function (response) {
			        that.join().done(function (d) {
			            $scope.callJoinRoomFromCtrl(response.data);
			        });
			    });
			}
			

			$scope.$watch("room.Name", function (value) {
				if (!value)
				    return;
				plLocalStorage.setStorage('roomName', value);
				roomManagement.getRoomFromName(name).then(function (response) {
				    var url = window.location.origin + "#/open/" + response.data;
				    $scope.shareRoomUrl = url;
				});
				//$location.path("/rooms/" + encodeURIComponent(value));
			});
		
			$scope.allCardsShowing = false;

			$scope.myCardValueChanged = function (item) {
				$scope.myCard = $scope.myCard || {};
				$scope.myCard.Value = item;
				that.changedMyCardValue($scope.myCard.Value);
			};

			$scope.roomTopicChanged = function () {
			    that.changeRoomTopic(angular.element($(".players")).scope().room.Topic);
			};

			$scope.closeJoinModal = function () {
				$scope.joinModal = !$scope.me.Name || !$scope.me.Email;
				$scope.joinRoomModal = !$scope.joinModal && !that.room;

				if (!$scope.joinModal) {
					that.join();
				}

				if (!$scope.joinRoomModal) {
					that.joinRoom();
				}
			};

			$scope.closeJoinRoomModal = function () {
			    $scope.joinRoomModal = !angular.element($(".players")).scope().room.Name;

				if (!$scope.joinRoomModal) {
					that.joinRoom();
				}
			};

			$scope.removeRoomUser = function () {
				that.leaveRoom(this.user);
			};

			$scope.resetRoom = function () {
			    angular.element($(".players")).scope().allCardsShowing = false;
			    that.showAllCards(false);
				that.resetRoom();
			};

			$scope.showAllCards = function (show) {
				that.showAllCards(show);
			};

			$scope.joinModalOptions = {
				backdrop: false,
				backdropClick: false
			};

			$scope.goOpen = function (path) {
			    $location.path(path);
			};

			//$scope.getRoomUrlId = function () {
			//    var name = plLocalStorage.getStorage('roomName');
            //}

			$scope.callJoinRoomFromCtrl = function (roomName) {
			    that.callJoinRoom({ Name: roomName });
			}

			this._poker.client.userChanged = function (user) {
				return _this.userChanged(user);
			};
			this._poker.client.userRemoved = function (user) {
				return _this.userRemoved(user);
			};
			this._poker.client.cardChanged = function (card) {
				return _this.cardChanged(card);
			};
			this._poker.client.roomTopicChanged = function (topic) {
			    angular.element($(".players")).scope().room.Topic = topic;
			    angular.element($(".players")).scope().$apply();
			};
			this._poker.client.showAllCards = function (show) {
			    angular.element($(".players")).scope().allCardsShowing = show;
			    angular.element($(".players")).scope().$apply();
			};
			this._poker.client.resetRoom = function (room) {
			    angular.element($(".players")).scope().room = room;
			    angular.element($(".players")).scope().myCard.Value = "";
			    angular.element($(".players")).scope().$apply();
			};

			$.connection.hub.start().done(function () {
				if (that.me) {
					that.join().done(function () {
						if (that.room) {
							//that.joinRoom();
						} else {
							$scope.joinRoomModal = true;
							$scope.$apply();
						}
					});
				} else {
					$scope.joinModal = true;
					$scope.$apply();
				}
			});
		}
		Object.defineProperty(PokerRoomCtrl.prototype, "myCard", {
			get: function () {
				var value = this.$scope.myCard;

				if (!value) {
					var userEmail = this.$cookies.userEmail;
					var userName = this.$cookies.userName;

					if (!userEmail)
						return null;

					value = new PokerCard();
					value.User = this.me;
					value.Value = "";
				}

				return value;
			},
			enumerable: true,
			configurable: true
		});

		Object.defineProperty(PokerRoomCtrl.prototype, "me", {
			get: function () {
				var value = this.$scope.me;

				if (!value) {
					var userEmail = this.$cookies.userEmail;
					var userName = this.$cookies.userName;

					if (!userEmail)
						return null;

					value = new PokerUser();
					value.Name = userName;
					value.Email = userEmail;
				}

				return value;
			},
			enumerable: true,
			configurable: true
		});

		Object.defineProperty(PokerRoomCtrl.prototype, "room", {
			get: function () {
			    var value = angular.element($(".players")).scope().room;

				if (!value) {
				    //var roomName = this.$location.path().replace("/rooms/", "");
				    var roomName = this.plLocalStorage.getStorage('roomName');
				    //var roomName = '';
					if (!roomName)
						return null;

					value = new PokerRoom();
					value.Name = roomName;

					angular.element($(".players")).scope().room = value;
				}

				return value;
			},
			enumerable: true,
			configurable: true
		});

		PokerRoomCtrl.prototype.userChanged = function (user) {
		    var room = angular.element($(".players")).scope().room;
		    if (room && room.Users) {
				var found = false;

				room.Users = room.Users.map(function (roomUser) {
					if (user.Email === roomUser.Email) {
						found = true;
						roomUser = user;
					}

					return roomUser;
				});

				if (!found)
					room.Users.push(user);

				this.$scope.$apply();
			}
		};

		PokerRoomCtrl.prototype.userRemoved = function (user) {
			var found = false;
			var room = angular.element($(".players")).scope().room;
			if (user.Email === this.$scope.me.Email) {
				room = null;
				this.$scope.myCard = null;
			    //this.$location.path("");
				this.plLocalStorage.setStorage('roomName', "");

				if (this.plLocalStorage.getStorage('isOwner')) {
				    this.plLocalStorage.setStorage('isOwner', false);
				}

				this.$scope.roomCreated = false;
				this.$scope.room = {};
			} else {
				room.Users = room.Users.filter(function (roomUser) {
					return user.Email !== roomUser.Email;
				});
				room.Cards = room.Cards.filter(function (roomCard) {
					return user.Email !== roomCard.User.Email;
				});
			}

			this.$scope.$apply();
		};

		PokerRoomCtrl.prototype.cardChanged = function (card) {
		    var _this = this;

		    //this is completely necessary because the context of this, cardChanged() is executed within Singnalr Context
		    var room = angular.element($(".players")).scope().room;

		    if (room && room.Cards) {
				var found = false;

				_this.$timeout(function () {
				    room.Cards = room.Cards.map(function (roomCard) {
				        if (card.User.Email === roomCard.User.Email) {
				            found = true;
				            roomCard = card;
				        }

				        return roomCard;
				    });

				    if (!found)
				        room.Cards.push(card);
				});
				//this.$scope.$apply();
			}
		};

		PokerRoomCtrl.prototype.join = function (user) {
		    if (typeof user === "undefined") {
		        user = this.me;
		    }
			var that = this;
			var ret = this._poker.server.join(user).done(function (data) {
			    that.$scope.me = data;
			    that.$scope.$apply();
			    //if (typeof callback == 'function') {
			    //    callback();
			    //}
			});
			return ret;
		};

		PokerRoomCtrl.prototype.joinRoom = function (room) {
		    if (typeof room === "undefined") {
		        room = angular.element($(".players")).scope().room;
		    }
		    //this.$location.path("/rooms/" + encodeURIComponent(room.Name));
		    var _this = this;
		    _this.roomManagement.send(room).then(function (response) {
		        
		        _this.callJoinRoom(room);
		    });
		};

		PokerRoomCtrl.prototype.callJoinRoom = function (room) {
		    var _this = this;
		    if (typeof room === "undefined") {
		        room = angular.element($(".players")).scope().room;
		    }
		    _this.roomManagement.isOwner(room.Name).then(function (response) {
		        if (response.data == true) {
		            _this.$scope.isOwner = true;
		        } else {
		            _this.$scope.isOwner = false;
		        }

		        _this.plLocalStorage.setStorage('roomName', room.Name);
		        //_this.plLocalStorage.setStorage('roomId', response.data);
		        _this.$scope.roomCreated = true;

		        ret = _this._poker.server.joinRoom(room).done(function (data) {
		            //this is completely necessary because the context of this, cardChanged() is executed within Singnalr Context
		            angular.element($(".players")).scope().room = data;
		            //_this.$scope.room = data;
		            //_this.$scope.roomAux = data;

		            var me = _this.me;
		            data.Cards.forEach(function (card) {
		                if (card.User.Email === me.Email)
		                    _this.$scope.myCard = card;
		            });

		            _this.$scope.$apply();
		        });

		        return ret;

		    });

		}

		PokerRoomCtrl.prototype.leaveRoom = function (user) {
		    if (typeof user === "undefined") { user = this.me; }

		    //this is completely necessary because the context of this, cardChanged() is executed within Singnalr Context
		    var room = angular.element($(".players")).scope().room;
		    //user = angular.element($(".players")).scope().me;

			return this._poker.server.leaveRoom(room, user);
		};

		PokerRoomCtrl.prototype.resetRoom = function () {
		    //this is completely necessary because the context of this, cardChanged() is executed within Singnalr Context
		    var room = angular.element($(".players")).scope().room;
			return this._poker.server.resetRoom(room);
		};

		PokerRoomCtrl.prototype.showAllCards = function (show) {
		    if (typeof show === "undefined") { show = true; }

		    //this is completely necessary because the context of this, cardChanged() is executed within Singnalr Context
		    var room = angular.element($(".players")).scope().room;

			return this._poker.server.showAllCards(room, show);
		};

		PokerRoomCtrl.prototype.changeRoomTopic = function (topic) {

		    //this is completely necessary because the context of this, cardChanged() is executed within Singnalr Context
		    var room = angular.element($(".players")).scope().room;

			return this._poker.server.changeRoomTopic(room, topic);
		};

		PokerRoomCtrl.prototype.changedMyCardValue = function (value) {

		    //this is completely necessary because the context of this, cardChanged() is executed within Singnalr Context
		    var room = angular.element($(".players")).scope().room;

			return this._poker.server.changedCard(room, value);
		};
		
		return PokerRoomCtrl;
	})();
	PlanningLab.PokerRoomCtrl = PokerRoomCtrl;

	app.controller("PokerRoomCtrl", PokerRoomCtrl);

	var PokerUser = (function () {
		function PokerUser() {
		}
		return PokerUser;
	})();
	PlanningLab.PokerUser = PokerUser;

	var PokerRoom = (function () {
		function PokerRoom() {
		}
		return PokerRoom;
	})();
	PlanningLab.PokerRoom = PokerRoom;

	var PokerCard = (function () {
		function PokerCard() {
		}
		return PokerCard;
	})();
	PlanningLab.PokerCard = PokerCard;
})(PlanningLab || (PlanningLab = {}));

