
import { GiftCardsController, GiftCardViewController } from './giftCardsController'
import { GiftCardsFactory } from './giftCardsFactory'
export default angular
  .module('gift_cards', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.gift-cards', { abstract: true, url: '/gift-cards', template: '<ui-view />' })
      .state('app.dashboard.gift-cards.index', { url: '?page&count&filters', templateUrl: 'app/shared/grid/grid_view.html', controller: 'GiftCardsController' })
      .state('app.dashboard.gift-cards.view', { url: '/:customer_id', templateUrl: 'app/modules/gift_cards/view_gift-card.html', controller: 'GiftCardViewController' })
  })
  .controller('GiftCardsController', GiftCardsController)
  .controller('GiftCardViewController', GiftCardViewController)
  .factory('GiftCardsFactory', GiftCardsFactory)
