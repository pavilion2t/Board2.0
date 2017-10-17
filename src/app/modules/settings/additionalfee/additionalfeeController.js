


export class AdditionalfeeController {
  constructor(AdditionalfeeFactory, $scope, $rootScope, $state, $stateParams, DashboardFactory, FormatterFactory, ItemMasterFactory, gettextCatalog) {
    'ngInject';

    $scope.title = 'Additional Fees';
    $scope.section = 'overview';


    var store_id = DashboardFactory.getStoreId();

    $scope.route = $rootScope.api + '/api/v2/stores/' + store_id + '/additional_fees';
    var nameFormatter = function(row, cell, value, columnDef, dataContext) {
      var nameHTML = '<p><a href="' + store_id + '/settings/additionalfee/' + dataContext.id + '">' + dataContext.listing_name + '</a></p>';
      var inventoryHTML = '<div class="_inventory-item _compile">' +nameHTML+ '</div>';
      return inventoryHTML;
    };

    var chargeTypeFormatter = function(row, cell, value, columnDef, dataContext) {
      if(value === 1) {
        return 'Per Person';
      }
      else if ( value === 2){
        return 'Per Order';
      }
    };
    var shippingMethodsFormatter = function(row, cell, value, columnDef, dataContext) {

      var finishValue = _.map(value, function(value){
        if(value === 0) {
          return 'Pick Up';
        }
        else if ( value === 1){
          return 'Delivery';
        }
        else if ( value === 2){
          return 'Dine In';
        }
        return '';
      });
      return finishValue.join(', ');
    };

    $scope.columns = [
      {field: "listing_name", name: gettextCatalog.getString("Name"), ratio: '50%', formatter: nameFormatter, pdfFormatter: 'raw'},
      {field: "listing_price", name: gettextCatalog.getString("Price"), ratio: '10%', formatter: FormatterFactory.dollarFormatter},
      {field: "charge_type", name: gettextCatalog.getString("Charge"), ratio: '10%', formatter: chargeTypeFormatter},
      {field: "charge_for_shipping_methods", name: gettextCatalog.getString("Shipping"), ratio: '30%', formatter: shippingMethodsFormatter},
    ];


    $scope.actions = [
      ['View', function(item) {
        $state.go('app.dashboard.settings.additionalfee.view', { listing_id: item.id });
      }],
      ['Delete', function(item) {
        if(!confirm('Do you really want to delete this item?')) return false;

        AdditionalfeeFactory.removeFee(item.id)
          .success(function(data) {
            console.log(data);
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function(err) {
            console.error(err);
            $scope.loadingGrid = false;
            $scope.errorMessage = err.message;
          });
      }]

    ];

    $scope.newFee = function(){

      $state.go('app.dashboard.settings.additionalfee.new');
    };



  }
}

export class AdditionalfeeNewController{
  constructor(AdditionalfeeFactory, $scope, $rootScope, $state, $stateParams, DashboardFactory, FormatterFactory, ItemMasterFactory, gettextCatalog) {
    'ngInject';

    $scope.isEnablingItem = true;
    $scope.additionalfee = {
      "charge_type": 1,
      "charge_for_shipping_methods": [],
      "auto_apply": false,
      "required_in_order": false,
    };
    $scope.additionalfeeshow = {};
    $scope.additionalfee.store_id = DashboardFactory.getStoreId();


    $scope.addItems = function(data){
      if (!data.value || !Array.isArray(data.value)) return;
      $scope.additionalfee.listing_ids =_.map(data.value, function(value){
        return value.id;
      });
      $scope.additionalfeeshow.listings =_.map(data.value, function(value){
        return {id:value.id,name:value.name,price:value.price};
      });
    };

    $scope.remove = function(index,listing){
      $scope.additionalfee.listing_ids.splice(index,1);
      $scope.additionalfeeshow.listings.splice(index,1);
    };


    $scope.save = function(){

      $scope.additionalfee.charge_type = parseInt($scope.additionalfee.charge_type, 10)
      $scope.additionalfee.charge_for_shipping_methods = [];

      if ( $scope.additionalfeeshow.pickUp ){
        $scope.additionalfee.charge_for_shipping_methods.push(0);
      }
      if ( $scope.additionalfeeshow.delivery ){
        $scope.additionalfee.charge_for_shipping_methods.push(1);
      }
      if ( $scope.additionalfeeshow.dineIn ){
        $scope.additionalfee.charge_for_shipping_methods.push(2);
      }

      AdditionalfeeFactory.createFee($scope.additionalfee).then(function(){
        $state.go('app.dashboard.settings.additionalfee.index');
      });

    };
    $scope.cancel = function(){
      $state.go('app.dashboard.settings.additionalfee.index');
    };
  }
}

export class AdditionalfeeViewController {
  constructor(AdditionalfeeFactory, $scope, $rootScope, $state, $stateParams, DashboardFactory, FormatterFactory, ItemMasterFactory, gettextCatalog) {
    'ngInject';

    $scope.isEnablingItem = false;
    AdditionalfeeFactory.getFee($stateParams.listing_id).then(function(res) {
      var value = res.data.additional_fee;
      $scope.additionalfee = value;
      $scope.additionalfeeshow = {};
      $scope.additionalfeeshow.listings = [];
      $scope.additionalfeeshow.listings.push({id:value.listing_id,name:value.listing_name,price:value.listing_price});

      if ( value.charge_for_shipping_methods.indexOf(0) !== -1 ) {
        $scope.additionalfeeshow.pickUp = true;
      }
      if ( value.charge_for_shipping_methods.indexOf(1) !== -1 ) {
        $scope.additionalfeeshow.delivery = true;
      }
      if ( value.charge_for_shipping_methods.indexOf(2) !== -1 ) {
        $scope.additionalfeeshow.dineIn = true;
      }
      delete $scope.additionalfee.deleted_at;
      delete $scope.additionalfee.listing_name;
      delete $scope.additionalfee.listing_price;
      delete $scope.additionalfee.listing_id;

    });
    $scope.additionalfee = {};
    $scope.additionalfeeshow = {};
    $scope.additionalfee.store_id = DashboardFactory.getStoreId();




    $scope.save = function(){

      $scope.additionalfee.charge_type = parseInt($scope.additionalfee.charge_type, 10);
      $scope.additionalfee.charge_for_shipping_methods = [];

      if ( $scope.additionalfeeshow.pickUp ){
        $scope.additionalfee.charge_for_shipping_methods.push(0);
      }
      if ( $scope.additionalfeeshow.delivery ){
        $scope.additionalfee.charge_for_shipping_methods.push(1);
      }
      if ( $scope.additionalfeeshow.dineIn ){
        $scope.additionalfee.charge_for_shipping_methods.push(2);
      }

      AdditionalfeeFactory.updateFee($scope.additionalfee.id, $scope.additionalfee).then(function(){
        $state.go('app.dashboard.settings.additionalfee.index');
      });
    };

    $scope.cancel = function(){
      $state.go('app.dashboard.settings.additionalfee.index');
    };

  }
}
