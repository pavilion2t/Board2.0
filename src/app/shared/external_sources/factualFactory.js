export function FactualFactory($rootScope, $http) {
  'ngInject';
  var getFilterOptions = function(countriesToSearch, regionsToSearch, localitiesToSearch, categoryLabelsToSearch) {
    if (countriesToSearch === undefined || countriesToSearch.length < 1) {
      countriesToSearch = ["US"];
    }
    if (regionsToSearch === undefined  || regionsToSearch.length < 1) {
      regionsToSearch = '';
    }
    if (localitiesToSearch === undefined  || localitiesToSearch.length < 1) {
      localitiesToSearch = '';
    }
    if (categoryLabelsToSearch === undefined  || categoryLabelsToSearch.length < 1) {
      categoryLabelsToSearch = '';
    }

    var filters = '{"$and":[' + formatFactualFilter(countriesToSearch, 'country', 1) + formatFactualFilter(regionsToSearch, 'region', 2) + formatFactualFilter(localitiesToSearch, 'locality', 3) + formatFactualFilter(categoryLabelsToSearch, 'category_labels', 4) + ']}';
    filters = encodeURIComponent(filters);

    return $http({
      // url: $rootScope.api + '/api/v2/admin/factual/places/facets?limit=50&select=locality,region,category_labels&filters=' + filters, //bindo API
      url: $rootScope.externalsources + '/factual/places/facets?limit=50&select=locality,region,category_labels&filters=' + filters, //new external sources API
      cache: true,
      method: "GET"
    });
  }

  var searchFactual = function(offset, keyword, countriesToSearch, regionsToSearch, localitiesToSearch, categoryIdsToSearch, categoryLabelsToSearch) {
    if (keyword === undefined || keyword.length < 1) {
      keyword = '';
    }
    if (countriesToSearch === undefined || countriesToSearch.length < 1) {
      countriesToSearch = ["US"];
    }
    if (regionsToSearch === undefined  || regionsToSearch.length < 1) {
      regionsToSearch = '';
    }
    if (localitiesToSearch === undefined  || localitiesToSearch.length < 1) {
      localitiesToSearch = '';
    }
    if (categoryIdsToSearch === undefined  || categoryIdsToSearch.length < 1) {
      categoryIdsToSearch = '';
    }
    if (categoryLabelsToSearch === undefined  || categoryLabelsToSearch.length < 1) {
      categoryLabelsToSearch = '';
    }

    if (offset === 0) {
      offset = '';
    } else {
      offset = '&offset=' + offset;
    }

    var filters = '{"$and":[' + formatFactualFilter(countriesToSearch, 'country', 1) + formatFactualFilter(regionsToSearch, 'region', 2) + formatFactualFilter(localitiesToSearch, 'locality', 3) + formatFactualFilter(categoryIdsToSearch, 'category_ids', 4) + formatFactualFilter(categoryLabelsToSearch, 'category_labels', 5) + ']}';
    filters = encodeURIComponent(filters);

    return $http({
      // url: $rootScope.api + '/api/v2/admin/factual/places/search?include_count=true&search=' + keyword + '&filters=' + filters + offset, //bindo API
      url: $rootScope.externalsources + '/factual/places/search?include_count=true&search=' + keyword + '&filters=' + filters + offset, //new external sources API
      method: "GET"
    });
  }

  function formatFactualFilter(searchArr, filterName, pos) {
    if (searchArr !== '' && searchArr.length) {
      var addComma = '';
      if (pos > 1) {
        addComma = ',';
      }

      if (searchArr && searchArr.length == 1 || filterName == 'category_labels') {
        searchArr = addComma + '{"' + filterName + '" : {"$eq": "' + searchArr + '"}}';
      } else if (searchArr && searchArr.length > 1) {
        searchArr = JSON.stringify(searchArr);
        searchArr = addComma + '{"' + filterName + '":{"$in":' + searchArr + '}}';
      }
      return searchArr;
    } else {
      return "";
    }
  }

  var getFactualListing = function(factualId) {
    return $http({
      // url: $rootScope.api + '/api/v2/admin/factual/places/' + factualId, //bindo API
      url: $rootScope.externalsources + '/factual/places/' + factualId, //new external sources API
      method: "GET"
    });
  }

  return {
    searchFactual: searchFactual,
    getFilterOptions: getFilterOptions,
    getFactualCategories : function() {
      return $http({
        url: 'assets/images/categories/factual_taxonomy.json',
        method: 'GET'
      })
    },
    getFactualListing: getFactualListing,
  };

}
