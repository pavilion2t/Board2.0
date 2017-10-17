export class GiftCardsController {
  constructor($rootScope, $scope, $state, DashboardFactory, FormatterFactory, gettextCatalog) {
    'ngInject';

    $scope.title = 'Gift Cards';
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('gift_card');
    // ROUTE
    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.gateway + '/v2/stores/' + store_id + '/customers_for_anonymous_gift_card';
    //$scope.route = $rootScope.gateway + '/v2/stores/' + store_id + '/gift_cards';

    // GRID

    var cardNumberFormatter = function(row, cell, value, columnDef, dataContext) {
      return '<a href="' + store_id + '/gift-cards/' + dataContext.id + '">' + value + '</a>';
    };

    $scope.columns = [
      {field: 'id', name: 'Customer ID', ratio: '25%',formatter:cardNumberFormatter, pdfFormatter: 'raw'},
      {field: 'name', name: 'Card Name', ratio: '25%'},
      {field: 'created_at', name: 'Created', ratio: '20%', formatter: FormatterFactory.dateFormatter},
      {field: 'updated_at', name: 'Updated', ratio: '20%', formatter: FormatterFactory.dateFormatter},
      {field: 'remaining_amount', name: 'Value', ratio:'10%',formatter: FormatterFactory.dollarFormatter}

    ];
    $scope.actions = [
      ['View', function(item) {
        $state.go('app.dashboard.gift-cards.view', { store_id: store_id, customer_id: item.id });
      }]
    ];
    $scope.objectWrap = 'customer';

    // FILTERS
    $scope.filterColumns = [
      {field: 'customer.card_number', name: gettextCatalog.getString('Card Number'), types: ['equal']},
      // {field: 'linked_at', name: 'Linked At', types: ['between'], isDate: true}
    ];

    // HACKS
    $scope.useAsId = 'id';
    $scope.isHidingNewButton = true;
    $scope.filterNotReady = true;

  }
}

export class GiftCardViewController {
  constructor($filter, $rootScope, $scope, $state, $http, $stateParams, DashboardFactory, GiftCardsFactory) {
    'ngInject';

    $scope.editPermission = DashboardFactory.getCurrentEditPermission('gift_card');


    var dollarFormatter = function(value) {
      return $filter('myCurrency')(value);
    };
    var dateFormatter = function(value, item) {
      return value ? new Date(value).toLocaleString() : '';
    };


    $scope.section = 'overview';
    $scope.editHistoryColumns = [
      {field: 'created_at', name: 'Date', ratio: '20%', formatter: dateFormatter},
      {field: 'order_number', name: 'Order Number', ratio: '40%'},
      {field: 'amount', name: 'Amount', ratio: '20%', formatter: dollarFormatter},
      {field: 'balance', name: 'Balance', ratio: '20%', formatter: dollarFormatter},
    ];
    $scope.bottomActions = [
      ['Back', function() {
        $state.go('app.dashboard.gift-cards.index', { store_id: DashboardFactory.getStoreId() });
      }, false],
    ];

    var _giftCardCache = {};
    $scope.enableEditMode = function() {
      $scope.editMode = true;
      angular.copy($scope.giftCard, _giftCardCache);
    };

    $scope.bottomActions = [
      ['Cancel', function() {
        if(confirm('Discard all changes?')) {
          angular.copy(_giftCardCache, $scope.giftCard);
          $scope.editMode = false;
        }
      }, false],
      ['Save', function() {


        GiftCardsFactory.postGift( $scope.giftCard.from_customer_id, $scope.giftCard.customer_id  )
          .success(function(data) {
            console.log(data);
            $state.go('app.dashboard.gift-cards.view', { store_id: DashboardFactory.getStoreId(), customer_id: $scope.giftCard.customer_id });
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });

      }, true]
    ];

    $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/customers_for_anonymous_gift_card?page=1&per_page=9999999')
      .success(function(data) {
        var cards = data;

        var _success = function(data) {
          $scope.history = _.map(data, function(item, i) {
            return _.extend(item, { id: i });
          }).reverse();
          $scope.giftCard.purchased_at = $scope.history.length ? $scope.history[$scope.history.length - 1].created_at : null;
          $scope.giftCard.last_update = $scope.history.length ? $scope.history[0].created_at : null;
          $scope.giftCard.current_balance = $scope.history.length ? $scope.history[0].balance : null;
          $scope.giftCard.spent = $scope.history.length ? $scope.history[$scope.history.length - 1].amount - $scope.history[0].balance : null;
        }

        for(var i = 0; i < cards.length; i++) {
          if(cards[i].customer.id === Number($stateParams.customer_id)) {


            $scope.giftCard = cards[i].customer;
            $scope.giftCard.card_number = $scope.giftCard.name;
            $scope.giftCard.customer_id = $scope.giftCard.id;
            $scope.giftCard.from_customer_id = $scope.giftCard.customer_id;
            $http.get($rootScope.analytics + '/v3/stores/' + DashboardFactory.getStoreId() + '/customers/' + $stateParams.customer_id + '/store_credit_histories')
              .success(_success)

            break;
          }

        }
        console.log($scope.giftCard);
      })
      .error(function(err) {
        console.error(err);
      });

  }
}
