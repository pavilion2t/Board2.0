export function AuthFactory($cookies, $rootScope, $http, $location, $state, DashboardFactory, BackEndFactory) {
  'ngInject';
  var storeCookieData = function(user) {

    $cookies.access_token = user.access_token;
    $cookies.user_id = user.id;
    $cookies.user_name = user.name;
    $cookies.email = user.email;
    $cookies.user_type = (user.belongs_to_internal ? 'ADMIN' : (user.belongs_to_courier ? 'COURIER' : 'USER'));
    $cookies.inventory_manager = (user.is_inventory_manager ? 'YES' : 'NO');
    $cookies.user_image = user.avatar || 'assets/images/user_placeholder.png';


  };
  var clearCookieData = function() {

    delete $cookies['user_id'];
    delete $cookies['user_name'];
    delete $cookies['email'];
    delete $cookies['user_type'];
    delete $cookies['access_token'];
    delete $cookies['inventory_manager'];
    delete $cookies['user_image'];
    delete $cookies['associate_type'];


  };

  var login = function (user) {
    // hack: clear old data
    $rootScope.stores = null;
    $rootScope.currentStores = null;
    $rootScope.updatedStore = null;

    let data = {
        client_id: $rootScope.clientId ,
        client_secret:  $rootScope.clientSecret,
        ...user,
    };

    // if(this.form.$invalid){
    //   return
    // }
    return $http({
      method: 'POST',
      url: $rootScope.api + '/api/v2/login',
      headers: { 'Content-Type': 'application/json', 'X-Application': $location.host()},
      data,
    });
  };
  var redirect = function(data) {
    clearCookieData();
    storeCookieData(data.user);
    var accessToken = data.user.access_token;
    $rootScope.accessToken = accessToken;
    updateHeaders(accessToken);

    $state.go('app.dashboard', { location: 'replace '});

  };

  var buildStoreTree = function(stores) {
    var oldStores = _.cloneDeep(stores);

    _.each(oldStores, function(store, i) {
      if(store.parent_id) {
        var parentStore = _.find(oldStores, function(s) {
          return s.id === store.parent_id;
        });
        if(parentStore) {
          if(parentStore._children) {
            parentStore._children.push(store);
          } else {
            parentStore._children = [store];
          }
          // hacks
          store._toDelete = true;
          parentStore.pos_active = true;
        }
      }
    });
    // TODO: support multiple-level chains
    var newStores = _.filter(oldStores, function(store) {
      return !store._toDelete;
    });

    var sortStores = function() {
      newStores.sort(function(s1, s2) {
        if(s1.pos_active && !s2.pos_active) {
          return -1;
        } else if(!s1.pos_active && s2.pos_active) {
          return 1;
        } else {
          return s1.title > s2.title;
        }
      });
    };
    // HACK: sort it twice wtf
    sortStores();
    sortStores();
    return newStores;
  };

  // 'clean' logout
  var logout = function() {

    clearCookieData();
    if (window.Intercom) window.Intercom('shutdown');
    window.location = '/';    // hack: reload angular app
  };
  // 'dirty' logout - $rootScope is not cleared
  var kickout = function() {
    clearCookieData();
    $location.url('/login');
  };
  var updateHeaders = function(accessToken) {

    $http.defaults.headers.common["X-APPLICATION"] = "dashboard.bindo.com";
    $http.defaults.headers.common['X-USER-ACCESS-TOKEN'] = accessToken;
    $http.defaults.headers.common["Authorization"] = "OAuth " + accessToken;

    $http.defaults.headers.common["X-USER-DEVICE-TYPE"] = 'pos';

    // $http.defaults.headers.common["Date-Format"] = '%F';
    // $http.defaults.headers.common["DateTime-Format"] = '%FT%T%:z';

    $http.defaults.headers.put['Content-Type'] = 'application/json';
    $http.defaults.headers.post['Content-Type'] = 'application/json';
  };

  var recoverPassword = function(email) {
    return $http.get($rootScope.api + '/api/v2/forgot_password', {
      params: {
        identifier: email ,
        client_id: $rootScope.clientId ,
        client_secret:  $rootScope.clientSecret,
      }
    });
  };

  return {
    login: login,
    redirect: redirect,
    buildStoreTree: buildStoreTree,
    logout: logout,
    kickout: kickout,
    updateHeaders: updateHeaders,
    recoverPassword: recoverPassword,
  };
}
