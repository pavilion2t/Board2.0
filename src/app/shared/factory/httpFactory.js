export function myHttpInterceptor($q, $rootScope, $location, messageFactory) {
      'ngInject';
    return {
     'request': function(config) {
        $rootScope.requestCounter = $rootScope.requestCounter || 0;
        if( $rootScope.requestCounter < 0 ) {
          $rootScope.requestCounter = 0; // prevent zombie spinner
        }
        $rootScope.requestCounter++;
        if(config.method === 'GET') {
          $rootScope.requestMessage = 'Loading...';
        } else if(config.method === 'POST' || config.method === 'PUT') {
          $rootScope.requestMessage = 'Saving...';
        }
        return config;
      },

      'response': function(response) {
        $rootScope.requestCounter--;
        return response;
      },
      'responseError': function(rejection) {

        if(rejection.status === 401 ) {
          $location.url('/login');
        }



        if(rejection.status != 404) {
          try {
            messageFactory.add(rejection.data.message);
          } catch(e) {
            console.error('e', e);
          }
        }

        $rootScope.requestCounter--;
        return $q.reject(rejection);
      },
    };
}
