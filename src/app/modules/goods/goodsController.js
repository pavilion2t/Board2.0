export class GoodsController{
  constructor($rootScope, $scope, $state, DashboardFactory, FormatterFactory, gettextCatalog, GoodsFactory, $stateParams, $q, note_type) {
    'ngInject';

    $scope.title = 'Good Received Note';
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('purchase_order');
    // ROUTE
    var store_id = DashboardFactory.getStoreId();



    $scope.route = $rootScope.gateway + '/v2/stores/' + store_id + '/receive_orders';

    $scope.defaultParams = [];
    $scope.note_type = note_type;
    if  (note_type === 'goods'){
      $scope.defaultParams.push({key:"note_type[]",value:1});
      $scope.abbrtitle = "G.R.N.";
      $scope.title = 'Good Received Note';
      $scope.newroute = "goods";
    }
    else if (note_type === 'return'){
      $scope.defaultParams.push({key:"note_type[]",value:[2,3]});
      $scope.abbrtitle = "R.N.";
      $scope.title = 'Return Note';
      $scope.newroute = "returnnote";
    }




    // GRID

    var cardNumberFormatter = function (row, cell, value, columnDef, dataContext) {
      return '<a href="' + store_id + '/'+$scope.newroute+'/' + dataContext.id + '">' + value + '</a>';
    };


    var statusFn = function (value) {
      if (!value){
        return '';
      }
      var text = value.replace('_', ' ');
      if (value === 'received' && $scope.note_type === 'return'){
        text = 'Returned';
      }
      return text;
    };
    var statusFormatter = function (row, column, value, columnDef, dataContext) {
      value = value || 'created';
      var text = statusFn(value);
      return '<span class="_capitalize"><i class="status-icon ' + value + '"></i>' + text + '</span>';
    };
    var typeFormatter= function (row, column, value, columnDef, dataContext) {
      if (dataContext.purchase_order_ids.length > 0){
        return 'Purchase Order';
      }
      else  if (dataContext.stock_transfer_ids.length > 0) {
        return 'Stock Transfer';
      }
      else {
        return 'Unknown';
      }
    };

    var notetypeFormatter= function (row, column, value, columnDef, dataContext) {
      if (dataContext.note_type === 1){
        return 'Goods Received Note';
      }
      else  if (dataContext.note_type === 2) {
        return 'Return Note';
      }
      else  if (dataContext.note_type === 3) {
        return 'Damage Return Note';
      }
      else {
        return 'Unknown';
      }
    };

    var quantityFormatter = function (row, column, value, columnDef, dataContext) {
      if (dataContext.purchase_order_ids.length > 0){
        return dataContext.purchase_order_ids.length;
      }
      else  if (dataContext.stock_transfer_ids.length > 0) {
        return dataContext.stock_transfer_ids.length;
      }
      else {
        return 0;
      }
    };

    $scope.columns = [
      {field: 'supplier_name', name: 'Supplier', ratio: '15%'},
      {field: 'created_at', name: 'Date', ratio: '20%', formatter: FormatterFactory.dateFormatter},
      {field: 'number', name: $scope.abbrtitle+' Number', ratio: '25%',formatter:cardNumberFormatter, pdfFormatter: 'raw'},
      {field: 'note_type', name: 'Note Type', ratio: '15%',formatter: notetypeFormatter },
      {field: 'type', name: 'Source Type', ratio: '15%',formatter: typeFormatter },
      {field: 'state', name: 'Status', ratio:'10%', formatter: statusFormatter}
    ];
    $scope.actions = [
      ['View', function (item) {
        $state.go('app.dashboard.goods.view', { store_id: store_id, id: item.id });
      }]
    ];
    //$scope.objectWrap = 'goods';



    // HACKS
    $scope.useAsId = 'id';
    $scope.isHidingNewButton = true;
    //$scope.filterNotReady = true;

    $scope.filterColumns = [
      {field: 'number', name: 'Order Number', types: ['contain', 'equal']},
      {field: 'supplier_name', name: 'Supplier Name', types: ['contain']},
      {field: 'created_at', name: 'Date Created', types: ['between'], isDate: true},
      {field: 'state', name: 'Status', types: ['options'], options: {'Pending': 'pending', 'Received': 'received', 'Submitted': 'submitted', 'Fulfilled': 'fulfilled', 'Cancelled': 'canceled'}}
    ];

    $scope.actions = [
      ['View', function (item) {
        $state.go('app.dashboard.'+$scope.newroute+'.view', { store_id: store_id, id: item.id });
      }],
      ['Cancel', function (item) {
        if (!confirm('Do you really want to cancel this item?')) return false;
        $scope.loadingGrid = true;
        GoodsFactory.deleteGoods(item.id)
          .success(function (data) {
            console.log(data);
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function (err) {
            console.error(err);
            $scope.loadingGrid = false;
            $scope.errorMessage = err.message;
          });
      },
        function () {
          return $scope.editPermission;
        }],
    ];

    $scope.createNewCustomItem = function (){
      GoodsFactory.returnMode = 'Normal';
      $state.go('app.dashboard.'+$scope.newroute+'.new', { store_id: store_id });
    };

    $scope.createNewDamageItem = function (){
      GoodsFactory.returnMode = 'Damage';
      $state.go('app.dashboard.'+$scope.newroute+'.new', { store_id: store_id });
    };

  }
}

export class GoodsViewController{
  constructor($filter, $rootScope, $scope, $state, $http, $stateParams, DashboardFactory, GoodsFactory, suppliers, PurchaseOrderFactory, AddPOFactory, InventoryFactory, $q, note_type) {
    'ngInject';

    var store_id = DashboardFactory.getStoreId();
    $scope.type = note_type;

    if  (note_type === 'goods'){
      $scope.note_type = 1;
      $scope.abbrtitle = "G.R.N.";
      $scope.title = 'Goods Received Note';
      $scope.newroute = "goods";
      $scope.receivetitle = "Receive";
      $scope.receivedtitle = "Received";
      $scope.costTitle = 'Cost';
    }
    else if (note_type === 'return'){

      if (GoodsFactory.returnMode === 'Normal'){
        $scope.note_type = 2;
        $scope.title = 'Return Note';
      }
      else {
        $scope.note_type = 3;
        $scope.title = 'Damage Return Note';
      }
      $scope.abbrtitle = "R.N.";
      $scope.newroute = "returnnote";
      $scope.receivetitle = "Return";
      $scope.receivedtitle = "Returned";
      $scope.costTitle = 'Price';
    }

    $scope.suppliers = suppliers;
    var supplierMap = {};

    _.each(suppliers,function (item){
      supplierMap[item.id] = item;
    });

    $scope.section = 'overview';

    $scope.showEditBtnByStatus = false;
    let hideEditBtnIfTheseStatus = (str) => _.includes(['returned', 'received', 'canceled'], str)
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('purchase_order');

    var _receive_orders_Cache = {};


    $scope.enableEditMode = function () {
      $scope.editMode = true;
      angular.copy($scope.receive_order, _receive_orders_Cache);
    };
    $scope.markAsReceived = () => {
      fulfillGRN()
    }

    $scope.bottomActions = [
      ['Cancel', function () {
        if (confirm('Discard all changes?')) {
          angular.copy(_receive_orders_Cache, $scope.receive_order);
          $scope.editMode = false;
        }
      }, false, () => true],
      ['Save', function () {
        saveGRN();
      }, true, () => true]
    ];



    var saveGRN = function (){
      var postdata = preparePostData();


      if ($scope.mode === 'new') {
        GoodsFactory.createGoods(postdata).success(function (data) {
          if (data && data.receive_order && data.receive_order.id) {
            $state.go('app.dashboard.'+$scope.newroute+'.view', {store_id: store_id, id:data.receive_order.id}, {reload: true});
          }
          else {
            alert('Fail to Save');
            $state.go('app.dashboard.'+$scope.newroute+'.index', {store_id: store_id}, {reload: true});
          }
        }).error(function (data){
          alert('Fail to Save');
          $state.go('app.dashboard.'+$scope.newroute+'.index', {store_id: store_id}, {reload: true});
        });
      }
      else {
        GoodsFactory.updateGoods($stateParams.id, postdata).success(function (data) {
          if (data && data.receive_order && data.receive_order.id) {
            updateROIID(data, postdata);
            $state.go('app.dashboard.'+$scope.newroute+'.view', {store_id: store_id, id:$stateParams.id}, {reload: true});
          }
          else {
            alert('Fail to Save');
            $state.go('app.dashboard.'+$scope.newroute+'.view', {store_id: store_id, id:$stateParams.id}, {reload: true});
          }
        }).error(function (data){
          alert('Fail to Save');
          $state.go('app.dashboard.'+$scope.newroute+'.view', {store_id: store_id, id:$stateParams.id}, {reload: true});
        });

      }
    };

    var fulfillGRN = function (){
      var postdata = preparePostData();
      fulfillGRNNext($stateParams.id, postdata);
    };

    $scope.itemUpdated = function (item){
      if (typeof item.quantity !== 'undefined' && typeof item.qty_fulfilled !== 'undefined') {
        item.quantity = new BigNumber(item.quantity).toNumber();
        item.qty_remaining = new BigNumber(item.poquantity).minus(new BigNumber(item.qty_fulfilled)).minus(new BigNumber(item.quantity).times(new BigNumber($scope.type === 'return' ? -1 : 1))).toNumber();
      }
    };

    $scope.fulfillAll = function (){
      for (var i = 0; i < $scope.receive_order.new_purchase_orders.length; i++){
        var order = $scope.receive_order.new_purchase_orders[i];
        for (var k = 0; k < order.items.length; k++){
          var item = order.items[k];
          if (typeof item.quantity === 'number' && typeof item.qty_received === 'number') {
            item.quantity = item.poquantity;
            item.qty_remaining = 0;
          }
        }
      }
    };

    var updateROIID = function (data, postdata){
      for (var i = 0; i < data.receive_order.receive_order_items.length; i ++){
        var new_receive_order_item = data.receive_order.receive_order_items[i].receive_order_item;
        var old_receive_order_item = postdata.receive_order_items[i];
        old_receive_order_item.id = new_receive_order_item.id;
      }
    };

    var fulfillGRNNext = function (id, postdata){
      //var postdata = preparePostData();

      var fulfillNeeded = false;
      _.each(postdata.receive_order_items, function (item) {
        let quantityInUi = Number(item.quantity) * (note_type === 'return' ? -1 : 1);
        if (quantityInUi > 0) {
          fulfillNeeded = true;
        } else {
          item.quantity = 0;
        }
      });

      if (fulfillNeeded) {
        GoodsFactory.fulfillGoods(id, postdata).then(function (data) {
          if (data && data.data && data.data.receive_order && data.data.receive_order.id) {
            $state.go('app.dashboard.'+$scope.newroute+'.view', {store_id: store_id, id: id}, {reload: true});
          }
          else {
            alert('Fail to Save');
            $state.go('app.dashboard.'+$scope.newroute+'.view', {store_id: store_id}, {reload: true});
          }
        });
      }
      else {
        $state.go('app.dashboard.'+$scope.newroute+'.view', {store_id: store_id, id: id}, {reload: true});
      }
    };

    var preparePostData = function (){
      var postdata = {};
      postdata.receive_order = {};
      postdata.receive_order_items = [];

      angular.copy($scope.receive_order,postdata.receive_order);
      delete postdata.receive_order.purchase_orders;

      postdata.receive_order.note_type = $scope.note_type;

      _.each(postdata.receive_order.new_purchase_orders, function (order){
        if (order) {
          _.each(order.items, function (item) {
            if (item) {
              item.serial_numbers = [];
              _.each(item._serial, function (serial) {
                item.serial_numbers.push(serial.value);
              });
              item.quantity = Number(item.quantity) * ($scope.type === 'return' ? -1 : 1);
              if ($scope.mode === 'new'){
                item.qty_remaining = Number(item.qty_requested) - Number(item.qty_received) - item.quantity;
              }else {
                item.qty_remaining = item.qty_remaining;
              }

              delete item._serial;
              delete item._enableSerialNumberEdit;
              delete item._enableExpirationDateEdit;

              delete item.serial_number_enabled;
              delete item.expiration_date_enabled;
              delete item.upc;
              delete item.barcode;
              delete item.name;
              delete item.source_id;

              postdata.receive_order_items.push(item);
            }
          });
        }
      });
      if ($scope.supplier){
        postdata.receive_order.supplier_id = $scope.supplier.id;
        postdata.receive_order.supplier_name = $scope.supplier.name;
      }


      delete postdata.receive_order.new_purchase_orders;
      delete postdata.receive_order.receive_order_items;
      return postdata;
    };

    $scope.deletePO = function (order, index){
      $scope.receive_order.new_purchase_orders.splice(index,1);
      $scope.receive_order.purchase_order_ids.splice(index,1);
    };

    $scope.deleteItem = function (order, index){
      order.items.splice(index,1);
    };


    $scope.fillInPO = function (listOfPO){

      if ((listOfPO === '$document' || listOfPO === '$closeButton' || listOfPO.length === 0) && $scope.mode === 'new'){
        $state.go('app.dashboard.'+$scope.newroute+'.index', {store_id: store_id}, {reload: true});
      }

      _.each(listOfPO, function (order){
        $scope.receive_order.new_purchase_orders.push(order.purchase_order);
        if ($scope.supplier === null){
          $scope.supplier = supplierMap[order.purchase_order.supplier_id];
        }
        $scope.receive_order.purchase_order_ids.push(order.purchase_order.id);
        delete $scope.receive_order.stock_transfer_ids;
        PurchaseOrderFactory.getPurchaseOrder(order.purchase_order.id, store_id).then(function (data){
          order.purchase_order.items = [];

          var listOfDefer = [];
          _.each(data.purchase_items, function (item){
            order.purchase_order.items.push(item);
            var defer = $q.defer();
            InventoryFactory.getInventory(item.source_id, store_id).then(function (data){
              //item = data;
              console.log($scope.receive_order);
              item._serial = _.map(item.serial_numbers, function (item){return {value:item};});
              item.serial_number_enabled = data.data.listing.serial_number_enabled;
              item.expiration_date_enabled = data.data.listing.expiration_date_enabled;
              item.upc = data.data.listing.upc;
              item.barcode = data.data.listing.barcode;
              item.product_id = data.data.listing.product_id;
              item.gtid = data.data.listing.gtid;
              item.listing_barcode = data.data.listing.listing_barcode;
              item.listing_reference_codes = data.data.listing.listing_reference_codes;
              item.purchase_item = {};
              item.purchase_item_id = item.id;
              item.purchase_item.name = item.name;
              item.purchase_item.purchase_order_id = order.purchase_order.id;
              item.purchase_item.source_id = item.source_id;

              delete item.id;
              delete item.source_id;
              defer.resolve();
            });

            listOfDefer.push(defer.promise);
          });
          $q.all(listOfDefer).then(function (){
            saveGRN();
          });
        });
      });
    };

    $scope.fillInPOInitial = function (orders){
      var defer = $q.defer();
      var purchaseOrderMap = {};

      _.each(orders, function (order) {

        order.purchase_order.items = [];
        $scope.receive_order.new_purchase_orders.push(order.purchase_order);
        purchaseOrderMap[order.purchase_order.id] = order.purchase_order;

        if ($scope.supplier === null) {
          $scope.supplier = supplierMap[order.purchase_order.supplier_id];
        }
        $scope.receive_order.purchase_order_ids.push(order.purchase_order.id);
        delete $scope.receive_order.stock_transfer_ids;
      });

      var ids = _.map($scope.receive_order.receive_order_items, function (value) {
        return value.receive_order_item.purchase_item.source_id;
      });


      if (ids.length > 0) {
        InventoryFactory.getInventoryList(ids, store_id).then(function (data) {
          //item = data;

          var itemMap = {};
          var i = 0;
          for (i = 0; i < data.data.listings.length; i++) {
            var listing = data.data.listings[i];
            var item = {};
            item.serial_number_enabled = listing.serial_number_enabled;
            item.expiration_date_enabled = listing.expiration_date_enabled;
            item.upc = listing.upc;
            item.barcode = listing.barcode;
            item.gtid = listing.gtid;
            item.listing_barcode = listing.listing_barcode;
            item.listing_reference_codes = listing.listing_reference_codes;
            item.name = listing.name;
            item.source_id = listing.id;
            item.description = item.name;
            itemMap[listing.id] = item;
          }
          var itemToValue = function (item) {
            return {value: item};
          };
          for (i = 0; i < $scope.receive_order.receive_order_items.length; i++) {
            var value = $scope.receive_order.receive_order_items[i];
            var itemInfo = itemMap[value.receive_order_item.purchase_item.source_id];
            for (var key in itemInfo) {
              value.receive_order_item[key] = itemInfo[key];
            }
            value.receive_order_item._serial = _.map(value.receive_order_item.serial_numbers, itemToValue);
            value.receive_order_item.poquantity = Number(value.receive_order_item.purchase_item.qty_requested);
            value.receive_order_item.quantity = Number(value.receive_order_item.quantity);
            value.receive_order_item.qty_received = Number(value.receive_order_item.qty_received || 0);
            value.receive_order_item.qty_remaining = Number(value.receive_order_item.qty_remaining);
            value.receive_order_item.qty_fulfilled = value.receive_order_item.poquantity - value.receive_order_item.qty_remaining - value.receive_order_item.quantity;

            value.receive_order_item.quantity *=  $scope.type === 'return' ? -1 : 1;
            value.receive_order_item.qty_received *=  $scope.type === 'return' ? -1 : 1;

            purchaseOrderMap[value.receive_order_item.purchase_item.purchase_order_id].items.push(value.receive_order_item);
            defer.resolve();

          }


        });
      }
      return defer.promise;
    };

    $scope.deleteSerial = function (item,index){
      item._serial.splice(index);
    };
    $scope.addSerialNumber = function (item){
      item._serial.push({value:''});
    };
    $scope.enterSerialNumber = function (item){
      item._enableSerialNumberEdit = true;
    };

    $scope.finishSerialNumber = function (item){
      item._enableSerialNumberEdit = false;
    };

    $scope.enterExpirationDate = function (item){
      item._enableExpirationDateEdit = true;
    };

    $scope.finishExpirationDate = function (item){
      item._enableExpirationDateEdit = false;
    };

    $scope.addPO = function (response){
      console.log(response.value);
      $scope.fillInPO(response.value);
    };
    $scope.fillInRO = function (data){
      var defer = $q.defer();
      $scope.receive_order = data.receive_order;
      if ($scope.receive_order.supplier_id) {
        $scope.supplier = supplierMap[$scope.receive_order.supplier_id];
      }

      var state_for_display = $scope.receive_order.state;
      if ($scope.type === 'return' && state_for_display === 'received'){
        state_for_display = 'returned';
      }
      $scope.receive_order.state_for_display = state_for_display || 'created';

      var orders = _.map(data.receive_order.purchase_orders,function (value) {
        return {purchase_order:value};
      });
      $scope.receive_order.purchase_order_ids = [];
      $scope.receive_order.new_purchase_orders = [];
      $scope.fillInPOInitial(orders).then(function (){defer.resolve();});

      $scope.showEditBtnByStatus = !hideEditBtnIfTheseStatus($scope.receive_order.state_for_display);

      return defer.promise;
    };

    $scope.mode = 'new';
    if ($state.current.name === 'app.dashboard.'+$scope.newroute+'.new') {
      $scope.supplier = null;
      $scope.onClose = $scope.addPO;
      $scope.singleSelect=true;


      AddPOFactory.open($scope);
      $scope.editMode = true;
      $scope.receive_order = {};
      $scope.receive_order.purchase_orders = [];
      $scope.receive_order.receive_order_items = [];
      $scope.receive_order.new_purchase_orders = [];
      $scope.receive_order.purchase_order_ids = [];
    }
    else {
      $scope.mode = 'view';
      GoodsFactory.getGoods($stateParams.id)
        .success(function (data) {
          $scope.fillInRO(data);
        });

    }

  }
}
