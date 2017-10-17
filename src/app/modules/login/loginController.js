export class LoginMainController {
  constructor($scope, $state, $location, $stateParams, AuthFactory) {
    'ngInject';

    if($stateParams.token) {
      setTimeout(function() {
        // ipCookie('access_token', $stateParams.token);
        window.location = '/';
      }, 1);
    }
  }
}


export class LoginController {
  constructor($rootScope, $scope, $state, $location, AuthFactory, messageFactory) {
    'ngInject';

    $scope.show_error = false;
    $scope.submitted = false;

    $scope.recover = function(user) {
      $scope.submitted = true;
      AuthFactory.recoverPassword(user.email)
        .success(function(data) {
          console.log(data);
          $state.go('app.login.recovery-email-sent');
        })
        .error(function(err) {
          $scope.errorMessage = err.message;
        });
    };
    $scope.reset_password = function(user){
      $scope.submitted = true;
      if(this.form.$invalid){
        return
      }
    };
    $scope.login = function(user) {
      $scope.hasLoginError = false;
      $scope.isLoggingIn = true;
      AuthFactory.login(user)
        .success(function(data) {
          $rootScope.showLogin = false;
          $scope.isLoggingIn = false;

          // clear legacy message
          messageFactory.clear();

          AuthFactory.redirect(data);
        })
        .error(function(err) {
          $scope.isLoggingIn = false;
          if(err.message === '401 Unauthorized') {
            $scope.errorMessage = 'The Bindo ID / email you entered is invalid.';
          } else {
            $scope.errorMessage = 'The login failed. Please try again.';
          }
          $scope.hasLoginError = true;
        });
    };
  }
}
