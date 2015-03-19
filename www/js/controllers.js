angular.module('live-estimation-poker.controllers', [])

.value('serverUrl', 'http://localhost:5000')

.service('Rooms', ['$http', 'serverUrl', function($http, serverUrl) {
  var Rooms = {
    load: function (user) {
      $http.get(serverUrl + '/rooms', { headers: user.headers() })
        .success(function (data) {
          Rooms.collection = data.rooms
        })
    }
  }

  return Rooms
}])

.service('User', ['$http', 'serverUrl', 'Rooms', function($http, serverUrl, Rooms) {
  var User = {
    login: function (params) {
      return $http.post(serverUrl + '/users/sign_in', { user: params })
          .success(function (data) {
            angular.extend(User, data.user)

            Rooms.load(User)
          })
          .error(function (data) {
            console.log(data)
          })
    },

    headers: function () {
      return {
        'X-User-Token': this.authentication_token,
        'X-User-Email': this.email
      }
    }
  }

  return User
}])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'User', function($scope, $ionicModal, $timeout, User) {
  // Form data for the login modal
  $scope.loginData = {}

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
  })

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide()
  }

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show()
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    User.login($scope.loginData).success(function () {
      $scope.closeLogin()
    })
  }
}])

.controller('HomeCtrl', ['$scope', '$http', '$stateParams', 'User', 'Rooms', function($scope, $http, $stateParams, User, Rooms) {
  $scope.rooms = Rooms
  $scope.user = User
}])
