export function YelpFactory($rootScope, $http) {
  'ngInject';
  var retrieveYelp = function(location, term, sort, offset) {
    var offsetString, sortString;

    if (location === undefined || location.length < 1) {
      location = "New York"; //default search
    }
    if (term === undefined || term.length < 1) {
      term = ""; //default search
    }
    if (offset || offset > 0) {
      offsetString = '&offset=' + offset;
    } else {
      offsetString = '';
    }
    if (sort || sort > 0) {
      sortString = '&sort=' + sort;
    } else {
      sortString = '';
    }

    return $http({
      // url: $rootScope.api + '/api/v2/admin/yelp/search?location=' + location + '&term=' + term + offsetString + sortString, //bindo API
      url: $rootScope.externalsources + '/yelp/search?location=' + location + '&term=' + term + offsetString + sortString, //new external sources API
      method: "GET"
    })
  }

  var getYelpListing = function(yelpId) {
    return $http({
      // url: $rootScope.api + '/api/v2/admin/yelp/business?yelp_id=' + yelpId, //bindo API
      url: $rootScope.externalsources + '/yelp/business?yelp_id=' + yelpId, //new external sources API
      method: "GET"
    });
  }

  return {
    retrieveYelp: retrieveYelp,
    getYelpListing: getYelpListing
  };

}
