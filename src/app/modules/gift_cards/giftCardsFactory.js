export function GiftCardsFactory($rootScope, $http, DashboardFactory, CommonFactory, messageFactory) {
  'ngInject';

  var postGift = function(from_cardid, to_customer) {
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/transfer_anonymous_gift_card', { 'source_anonymous_gift_card_id': parseInt(from_cardid), 'destination_customer_id': parseInt(to_customer) });
  };

  return {
    postGift: postGift
  }
}
