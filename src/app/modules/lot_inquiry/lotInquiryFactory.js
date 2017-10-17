function jsonToQueryString(json) {
  if ( json !== null || typeof json !== 'undefined' ) {
    return '?' + Object.keys(json).map(
        function (key) {
            if (Array.isArray(json[key])) {
                return json[key].map(function(value) {
                    return encodeURIComponent(key) + encodeURIComponent('[]') + '=' + encodeURIComponent(value);
                }).join('&');
            }
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
        }
      ).join('&');
  }
  return "";
}

export function LotInquiryFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  const getLotInquiries = function (qs) {
    return $http.get($rootScope.api + '/api/v2/listing_batches/balance_inquiry' + jsonToQueryString(qs));
    // return $http.get($rootScope.api + '/api/v2/listing_batches/balance_inquiry?page=1&per_page=200&store_ids[]=382&include_open_balance=1&include_zero_balance=0&product_ids[]=315393&product_ids[]=314932&date_from=2017-01-01&date_to=2017-01-02');
  }

  return {
    getLotInquiries
  };

}
