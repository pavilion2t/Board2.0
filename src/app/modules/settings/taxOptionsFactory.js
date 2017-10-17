export function TaxOptionsFactory ($rootScope, $http, $q, DashboardFactory) {
  'ngInject';

  var get = function(id, storeId) {
    var path = id ?  _apiPath(storeId) + '/' + id : _apiPath(storeId);

    var deferred = $q.defer();

    $http.get(path, { params: {per_page: 999} }).success((data) => {
      deferred.resolve(_parser(data));
    });

    return deferred.promise;
  };

  var makePrimary = function(id){
    return $http.put(_apiPath() + '/' + id + '/primary');
  };

  var create = function(data) {
    return $http.post(_apiPath(), { tax_option: _formatter(data) });
  };
  var update = function(id, data) {
    return $http.put(_apiPath() + '/' + id, {tax_option: _formatter(data)});
  };

  var remove = function(id) {
    return $http.delete(_apiPath() + '/' + id);
  };

  var _apiPath = function(storeId) {
    storeId = storeId || DashboardFactory.getStoreId();
    return $rootScope.api + '/api/v2/stores/' + storeId + '/tax_options';
  }

  var _parser = function(taxOptions) {

    return _.map(taxOptions, (item) => {
      var option = item.tax_option
      if( option.tax_type !== 3 ) { // If not Bottle Deposit
        option.tax_rate = (option.tax_rate*100).toFixed(4);
        option.tax_rate_text = option.tax_rate + '%'
      } else {
        option.tax_rate_text = '$' + option.tax_rate
      }
      try {
        option.tax_type_name = _.find(taxTypes, {id: option.tax_type}).name
        option.method_name = _.find(taxMethods, {id: option.method}).name
      } catch(e) {
        // fall back
        option.tax_type_name = 'not set';
        option.method_name = 'not set';
      }
      return option;
    });

  };

  var _formatter = function(taxOption) {
    var newTaxOption = _.clone(taxOption)
    if(newTaxOption.tax_type === 1 || taxOption.tax_type === 2) {
      newTaxOption.tax_rate = newTaxOption.tax_rate/100
    }
    return newTaxOption
  };

  var taxTypes = [
    {id:1, name:"Tax (Default)"},
    {id:2, name:"Service Fee"},
    {id:3, name:"Bottle Deposit"}
  ]

  var taxMethods = [
    {id: 1, name: "Normal (Default)", detail: ""},
    {id: 2, name: "Threshold", detail: "Product price equal or over threshold amount, tax would automatically applied to entire order."},
    {id: 3, name: "Exempt", detail: "The Tax above specific amount only extra amount is taxable."}
  ]

  return {
    get: get,
    create: create,
    update: update,
    remove: remove,
    makePrimary: makePrimary,
    taxTypes: taxTypes,
    taxMethods: taxMethods
  };

}
