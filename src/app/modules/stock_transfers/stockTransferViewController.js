function cookStockTransferItems(stockTransferItems, type) {
  return _.map(stockTransferItems, function (item) {
    var serial_numbers, listing;


    if (type === 'outbound') {
      listing = item.departing_listing;

    } else if (type === 'inbound') {
      listing = item.receiving_listing;

    } else {
      throw ('transfer type unknown');
    }

    if (listing.serial_number_enabled) {
      serial_numbers = _.map(item.serial_numbers, function (serial) {
        serial.received = _.some(item.receiving_listing.serial_numbers, { number: serial.number });
        return serial;
      });
      // sort received to head
      serial_numbers.sort(function (a, b) {
        return a.received ? -1 : 1;
      });
    }

    return {
      id: item.id,
      listing: listing,
      serial_numbers: serial_numbers,
      qty_departed: item.qty_departed,
      qty_requested: item.qty_requested,
      qty_received: item.qty_received,
      departing_listing: item.departing_listing,
      receiving_listing: item.receiving_listing,
    };
  });
}

// TODO: now serial_numbers always considered changed, need to fix
function diffUpdateData(updatedItems, originItems) {
  var diff = _.reduce(originItems, function (result, item) {
    var compareTarget = _.find(updatedItems, { id: item.id });
    for (var objectKey of ['qty_departed', 'qty_received', 'qty_requested', 'serial_numbers']) {
      if (!_.isEqual(item[objectKey], compareTarget[objectKey])) {
        result[item.id] = result[item.id] || {};
        result[item.id][objectKey] = compareTarget[objectKey];
      }
    }
    console.log('compareTarget', compareTarget);
    // if serial_numbers is changed, need qty_departed or qty_received too
    if (!_.isEqual(item.serial_numbers, compareTarget.serial_numbers)) {
      result[item.id]['serial_numbers'] = _.map(compareTarget['serial_numbers'], function (serial) {
        if (serial) {
          return serial.number;
        }
      });
      result[item.id]['qty_departed'] = compareTarget['qty_departed'];
      result[item.id]['qty_received'] = compareTarget['qty_received'];
    }
    return result;
  }, {});
  return diff;
}

export class StockTransferViewController {
  constructor(ngDialog, $scope, $rootScope, $http, $timeout, $compile, $q, $state, $stateParams, $filter, DashboardFactory, StockTransferFactory, FormatterFactory) {
    'ngInject';

    $scope.stockTransfer = {};
    $scope.newListingsToAdd = {};

    $scope.editPermission = true;


    var store_id = DashboardFactory.getStoreId();
    var nameFormatter = function (value, item) {
      var listing;
      if (item.state === 'new') {
        listing = item.listing;
      } else if (store_id === $scope.stockTransfer.departing_store_id) {
        listing = item.departing_listing;
      } else if (store_id === $scope.stockTransfer.receiving_store_id) {
        // show departing listing if receiving listing is not created yet
        listing = item.receiving_listing || item.departing_listing;
      }
      return FormatterFactory.listingInfoFormatter(null, listing);
    };

    var statusFormatter = function (value, item) {
      if (value === 'pending') {
        value = 'created';
      }
      var text = _.map(value.split('_'), function (word) {
        return word[0].toUpperCase() + word.slice(1);
      });
      return '<span><i class="status-icon ' + value + '"></i>' + text.join(' ') + '</span>';
    };

    $scope.editColumns = [
      { field: null, name: 'Name', ratio: '50%', formatter: nameFormatter, bindHtml: true },
      { field: 'qty_requested', name: 'QTY Requested', ratio: '12%', editable: true, type: 'number' },
      { field: 'qty_departed', name: 'QTY Departed', ratio: '12%', type: 'number' },
      { field: 'qty_received', name: 'QTY Received', ratio: '12%', type: 'number' },
      { field: 'state', name: 'State', ratio: '12%', formatter: statusFormatter, bindHtml: true },
    ];

    $scope.columnsForExtraData = [
      { field: 'expiration_date', ratio: '50%', formatter: (v) => `Expiration Date:  ${$filter('moment')(v)}`},
      { field: 'qty_requested', ratio: '12%' },
      { field: 'qty_departed', ratio: '12%' },
      { field: 'qty_received', ratio: '12%' },
      { field: 'state', ratio: '12%' },
    ];

    $scope.editRowHeight = 80;

    $scope.removeStockTransferItem = function (i, item) {
      $scope.stockTransfer.stock_transfer_items[i].qty_requested = 0;
    };

    $scope.bottomActions = [
      ['Cancel', function () {
        $state.reload();
      }, function () {
        return $scope.editMode;
      }, false],

      ['Save', function () {
        StockTransferFactory.updateStockTransfer($scope.stockTransfer.id, $scope.stockTransfer)
          .success(function (data) {
            console.log(data);
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function (err) {
            if (status === 401) {
              $scope.errorMessage = 'Store Transfers only works for Chain. Please contact 1800-692-4636 for more information.';
            } else {
              $scope.errorMessage = err.message || 'Error when saving';
            }
          });
      }, function () {
        return $scope.editMode;
      }, true],

      ['Update Departed Quantities', function () {
        $scope.startShippingTransfer();
      }, function (transfer) {
        return ['approved', 'in_transit'].indexOf(transfer.state) !== -1
          && store_id === transfer.departing_store_id;
      }, true],
      ['Update Fulfilled Quantities', function () {
        $scope.startFulfillingTransfer();
      }, function (transfer) {
        return ['approved', 'in_transit', 'sent'].indexOf(transfer.state) !== -1
          && store_id === transfer.receiving_store_id;
      }, true],

      ['Submit Transfer', function (item) {
        StockTransferFactory.submitStockTransfer($scope.stockTransfer.id)
          .success(function (data) {
            alert('Success submited stock transfer.');
            $state.reload();
          })
          .error(function (err) {
            console.error(err);
            $scope.errorMessage = err.message;
          });
      }, function (transfer) {
        return transfer.state === 'pending';
      }, true],
      ['Approve Transfer', function () {
        StockTransferFactory.approveStockTransfer($scope.stockTransfer.id)
          .success(function (data) {
            alert('Success approve stock transfer.');
            $state.reload();

          })
          .error(function (err) {
            console.error(err);
            $scope.errorMessage = err.message;
          });
      }, function (transfer) {
        if (transfer.state !== 'submitted') {
          return false;
        }
        if (transfer.initial_direction === 'depart') {
          return transfer.receiving_store_id === store_id;
        } else if (transfer.initial_direction === 'receive') {
          return transfer.departing_store_id === store_id;
        }

      }, true],

      ['Print', function (item) {

        $('body').addClass('printingMode');
        window.print();
        $('body').removeClass('printingMode');

      }, function () {
        return true;
      }, true]

    ];


    $scope.editable = function () {
      return _.include(['pending', 'submitted'], $scope.stockTransfer.state);
    };
    //

    $scope.startShippingTransfer = function () {
      ngDialog.open({
        template: 'app/modules/stock_transfers/transfer_shipping.html',
        controller: 'ShippingTransferContorller',
        data: {
          type: $scope.stockTransfer.type,
          stockTransferId: $scope.stockTransfer.id,
          stockTransferItems: _.cloneDeep($scope.stockTransfer.stock_transfer_items),
        },
        className: 'ngdialog-theme-default ngdialog-theme-mega'
      })
        .closePromise.then(function (response) {
        if (response.value === true) {
          $state.reload();
        }
      });
    };
    $scope.startFulfillingTransfer = function () {
      ngDialog.open({
        template: 'app/modules/stock_transfers/transfer_fulfilling.html',
        controller: 'FulfillingTransferContorller',
        data: {
          type: $scope.stockTransfer.type,
          stockTransferId: $scope.stockTransfer.id,
          stockTransferItems: _.cloneDeep($scope.stockTransfer.stock_transfer_items),
        },
        className: 'ngdialog-theme-default ngdialog-theme-mega'
      })
        .closePromise.then(function (response) {
        if (response.value === true) {
          $state.reload();
        }
      });
    };


    // ADDING LISTINGS
    $scope.addItems = function (res) {
      if (res.value == "$closeButton" || res.value == "$document") {
        return;
      }

      var selectedLisings = res.value;

      var listingsToAdd = _.map(selectedLisings, function (listing) {
        return {
          name: listing.name,
          upc: listing.upc,
          qty_requested: listing.qtyRequested,
          qty_departed: 0,
          qty_received: 0,
          listing: listing,
          listing_id: listing.id,
          inventory_quantity: listing.quantity,
          state: 'new'
        };
      });

      if (listingsToAdd.length > 0){
        let newItems = $scope.stockTransfer.stock_transfer_items.slice(0);
        listingsToAdd.forEach(item => {
          const target = _.find(newItems, newItem =>
                                            (newItem.listing||{}).product_id === item.listing.product_id ||
                                            (newItem.departing_listing||{}).product_id === item.listing.product_id ||
                                            (newItem.receiving_listing||{}).product_id === item.listing.product_id);
          if (target){
            target.qty_requested += item.qty_requested;
          } else {
            newItems.push(item);
          }
        });
        $scope.stockTransfer.stock_transfer_items = newItems;
      }

      // $scope.stockTransfer.stock_transfer_items = _.unique($scope.stockTransfer.stock_transfer_items.concat(listingsToAdd), function (item) {
      //   return item.listing_id || item.departing_listing.product_id || item.receiving_listing.product_id;
      // });

    };

    StockTransferFactory.getStockTransfer($stateParams.id)
      .success(function (data) {
        var stockTransfer = data.stock_transfer;

        if (stockTransfer.departing_store_id === store_id) {
          stockTransfer.type = 'outbound';
        } else if (stockTransfer.receiving_store_id === store_id) {
          stockTransfer.type = 'inbound';
        }

        $scope.stockTransfer = stockTransfer;
        $scope.oldStockTransfer = _.cloneDeep(stockTransfer);
        $timeout(function () {
          $('._compile').not('.ng-scope').each(function (i, el) {
            $compile(el)($scope);
          });
        }, 1);

      })
      .error(function (err) {
        console.error(err);
        $scope.errorMessage = err.message;
      });
  }
}

export class ShippingTransferContorller {
  constructor(StockTransferFactory, $scope, $q) {
    'ngInject';

    var stockTransferId = $scope.ngDialogData.stockTransferId;
    var type = $scope.ngDialogData.type;

    $scope.stockTransferItems = cookStockTransferItems($scope.ngDialogData.stockTransferItems, type);

    $scope.updateSerialInput = function (item) {
      if (!item.listing.serial_number_enabled) {
        return;
      }

      // check qty_received
      if (item.qty_departed < item.qty_received) {
        item.qty_departed = item.qty_received;
      }

      if (item.qty_departed > item.serial_numbers.length) {
        _.times(item.qty_departed - item.serial_numbers.length, function () {
          item.serial_numbers.push({});
        });

      } else {
        item.serial_numbers.length = item.qty_departed;
      }
    };

    function validateTransfer(stockTransferItems) {
      return false;
    }

    $scope.shipAll = function () {
      _.forEach($scope.stockTransferItems, function (item) {
        item.qty_departed = item.qty_requested;

        $scope.updateSerialInput(item);
      });
    };

    $scope.updateQuantities = function () {

      $scope.shippingTransferMessage = '';


      validate.validators.checkSerial = function (value, options, key, attributes) {
        if (!attributes.departing_listing.serial_number_enabled) {
          return null;
        }

        var availibleNumbers = _.map(attributes.departing_listing.serial_numbers, function (serial) {
          return serial.number;
        }).concat(attributes.serial_numbers.map(function (serial) {
            return serial.number;
          })
        );

        _.map(attributes.departing_listing.serial_numbers, function (serial) {
          return serial.number;
        });

        var emptyInputs = _.filter(value, function (v) {
          return v.number === '' || v.number === undefined;
        });

        if (emptyInputs.length > 0) {
          return '^Serial number field should not empty.';
        }


        var wrongNumbers = _(value)
          .filter(function (v) {
            return !v.received;
          })
          .map(function (v) {
            return v.number;
          })
          .filter(function (v) {
            return !_.includes(availibleNumbers, v);
          })
          .value();

        if (wrongNumbers.length > 0) {
          return '^Invalid serial number: ' + wrongNumbers.join(', ') + '.';
        }
      };

      // [1] validate input
      if (!validateTransfer($scope.stockTransferItems)) {
        var constraints = {
          serial_numbers: { checkSerial: 'option' }
        };

        _.forEach($scope.stockTransferItems, function (item) {
          item.validateResult = validate(item, constraints);
        });

        var validarteResults = _.map($scope.stockTransferItems, function (item) {
          return validate(item, constraints);
        });

        if (_.compact(validarteResults).length > 0) {
          return;
        }
      }

      // [1] Only value that changed need to PUT
      var diffs = diffUpdateData($scope.stockTransferItems, $scope.ngDialogData.stockTransferItems);

      // [2] An request can only update an item
      var updatingPromises = _.map(diffs, function (diff, itemId) {
        return StockTransferFactory.updateStockTransferItem(stockTransferId, itemId, diff);
      });

      // [3] Go!
      $q.all(updatingPromises)
        .then(function (results) {
          $scope.closeThisDialog(true);
        })
        .catch(function (err) {
          console.error(err);
          $scope.shippingTransferMessage = err.data.message || 'Error when saving';
        });
    };

    $scope.validateQtyDeparted = function (idx) {
      let currentItem = _.get($scope, `stockTransferItems[${idx}]`);
      if (!currentItem) return;
      if (currentItem.qty_requested < currentItem.qty_departed) {
        $scope.stockTransferItems[idx].qty_departed = currentItem.qty_requested;
      }
      if (currentItem.qty_departed < currentItem.qty_received) {
        $scope.stockTransferItems[idx].qty_departed = currentItem.qty_received;
      }
    };
  }
}

export class FulfillingTransferContorller {
  constructor(StockTransferFactory, $scope, $q) {
    'ngInject';

    var stockTransferId = $scope.ngDialogData.stockTransferId;
    var type = $scope.ngDialogData.type;

    $scope.stockTransferItems = cookStockTransferItems($scope.ngDialogData.stockTransferItems, type);

    $scope.updateQtyReceived = function (item) {
      console.log('item', item);
      item.qty_received = item.serial_numbers.filter(function (serial) {
        return serial.received;
      }).length;
    };

    $scope.fulfillAll = function () {
      _.forEach($scope.stockTransferItems, function (item) {
        item.qty_received = Math.min(item.qty_requested, item.qty_departed);
        _.forEach(item.serial_numbers, function (serial) {
          serial.received = true;
        });
      });
    };

    $scope.updateQuantities = function () {
      $scope.fulfillingTransferMessage = '';

      // [1] Only value that changed need to PUT
      // var diffs = diffUpdateData($scope.stockTransferItems, $scope.ngDialogData.stockTransferItems)

      // [2] An request can only update an item
      var updatingPromises = _.map($scope.stockTransferItems, function (item) {
        console.log('item', item);
        var data = {
          qty_received: item.qty_received,
          serial_numbers: _.reduce(item.serial_numbers, function (acc, serial) {
            if (serial.received)
              acc.push(serial.number);
            return acc;
          }, [])
        };
        console.log('data', data);
        return StockTransferFactory.updateStockTransferItem(stockTransferId, item.id, data);
      });

      // [3] Go!
      $q.all(updatingPromises)
        .then(function (results) {
            $scope.closeThisDialog(true);
          },
          function (err) {
            console.error(err);
            $scope.fulfillingTransferMessage = err.data.message || 'Error when saving';
          });
    };

    $scope.validateQtyReceived = function (idx) {
      let currentItem = _.get($scope, `stockTransferItems[${idx}]`);
      if (!currentItem) return;
      if (currentItem.qty_departed < currentItem.qty_received) {
        $scope.stockTransferItems[idx].qty_received = currentItem.qty_departed;
      }
    };
  }
}
