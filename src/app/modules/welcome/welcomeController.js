export class WelcomeController {
  constructor($scope, $rootScope, $http, $state, AuthFactory, AnswersOptions, $cookies) {
    'ngInject';

    // STATES
    var storeIsSaved = false;
    $scope.isContinue = true;

    // INITIALIZE MODAL SLIDER
    var slider;
    $scope.initSlidr = function () {
      slider = slidr.create('welcome__modal', {
        transition: 'cube',
        timing: { cube: '0.3s ease-in' }
      }).start();
      // select which modal view & step
      $scope.currentModal = 0;
      slider.slide(String($scope.currentModal));
    };

    // MANUAL FORM VALIDATOR
    $scope.filled = function () {
      var inputs = $('#modal-' + $scope.currentModal).find('input');
      // check inputs
      for (var i = 0; i < inputs.length; i++) {
        if ($(inputs[i]).val() === '' && !$(inputs[i]).hasClass('optional')) {
          $scope.attention = true;
          return false;
        }
      }
      // check selects
      var selects = $('#modal-' + $scope.currentModal).find('select');
      for (var i = 0; i < selects.length; i++) {
        if ($(selects[i]).val() === null) {
          $scope.attention = true;
          return false;
        }
      }
      $scope.attention = false;
      return true;
    };

    // SLIDER MODAL PAGE TOGGLE
    $scope.continue = function () {
      console.log($scope.currentModal);
      if ($scope.currentModal === 0 || $scope.filled()) {
        // all fields filled
        if ($scope.currentModal === 1) {
          $scope.searchStore($scope.searchedStore, true);
        }
        $scope.currentModal++;
        slider.slide(String($scope.currentModal));
      }
    };
    $scope.back = function () {
      $scope.currentModal--;
      slider.slide(String($scope.currentModal));
      if ($scope.currentModal === 2) {
        $scope.searchStore($scope.searchedStore, false);
      }
    };
    $scope.createRange = function (start, end) {
      return _.range(start, end);
    };

    // custom back/continue functions for special modals
    $scope.modal2Loading = true;
    $scope.modal2MissingData = false;

    $scope.modal2Continue = function () {
      $scope.isContinue = false;
      if ($scope.modal2MissingData) {
        // create custom store
        if ($scope.filled()) {
          if (!storeIsSaved) {
            // create store
            $scope.user = {
              id: $cookies['user_id'],
              email: $cookies['email'],
              pos_active: false
            };
            $http.post($rootScope.api + '/api/v2/stores', { store: $scope.finalStore, user: $scope.user })
              .success(function (data) {
                storeIsSaved = true;
                var store = _.cloneDeep(data.store);
                if ($rootScope.stores) {
                  $rootScope.stores.push(data.store);
                } else {
                  $rootScope.stores = [data.store];
                }
                $rootScope.currentStores = [data.store];
                $scope.storeId = data.store.id;
                $scope.currentModal++;
                slider.slide(String($scope.currentModal));
              })
              .error(function (err) {
                console.error(err);
              });
          } else {
            // update store
            $http.put($rootScope.api + '/api/v2/stores/' + $scope.storeId, { store_attributes: $scope.finalStore })
              .success(function (data) {
                $scope.currentModal++;
                slider.slide(String($scope.currentModal));
              })
              .error(function (err) {
                console.error(err);
              });
          }
        }
      } else if (!$scope.modal2LoadingMap) {
        // create suggested store
        if ($scope.selectedStore) {
          $scope.finalStore = $scope.selectedStore;

          var store = {
            factual_id: $scope.finalStore.factual_id,
            title: $scope.finalStore.store_name,
            phone: $scope.finalStore.phone,
            address1: $scope.finalStore.address,
            city: $scope.finalStore.city,
            state: $scope.finalStore.state,
            zipcode: $scope.finalStore.zipcode,
            lat: Number($scope.finalStore.lat),
            lng: Number($scope.finalStore.lng)
          };
          // save to DB
          $scope.user = {
            id: $cookies['user_id'],
            email: $cookies['email'],
            pos_active: false
          };
          if (!storeIsSaved) {
            $http.post($rootScope.api + '/api/v2/stores', { store: store, user: $scope.user })
              .success(function (data) {
                $scope.isContinue = true;
                storeIsSaved = true;
                var store = _.cloneDeep(data.store);

                if ($rootScope.stores === null || typeof $rootScope.stores === "undefined") $rootScope.stores = [];
                $rootScope.stores.push(data.store);
                $rootScope.currentStores = [data.store];
                $scope.storeId = store.id;
                $scope.currentModal++;
                slider.slide(String($scope.currentModal));
              })
              .error(function (err) {
                console.error(err);
                $scope.isContinue = true;
              });
          } else {
            $scope.isContinue = true;
            $scope.currentModal++;
            slider.slide(String($scope.currentModal));
          }

        } else {
          // start to enter custom store info
          $scope.finalStore = {
            title: $scope.searchedStore.store_name,
            // country: $scope.searchedStore.country,
            zipcode: $scope.searchedStore.zip,
            phone: $scope.searchedStore.phone
          };
          $scope.modal2MissingData = true;
        }
      }
    }
    $scope.modal2Back = function () {
      if ($scope.modal2MissingData) {
        $scope.modal2MissingData = false;
      } else {
        $scope.currentModal--;
        slider.slide(String($scope.currentModal));
      }
    };
    $scope.surveyContinue = function () {
      if ($scope.filled()) {
        var storeAttributes = {};

        // hack: jquery
        var inputs = $('#modal-' + $scope.currentModal).find('input');
        var selects = $('#modal-' + $scope.currentModal).find('select');

        $.each(inputs, function (i, el) {
          if ($(el).attr('name')) {
            storeAttributes[$(el).attr('name')] = $(el).val();
          }
        });
        $.each(selects, function (i, el) {
          if ($(el).attr('name')) {
            storeAttributes[$(el).attr('name')] = $(el).val();
          }
        });
        if ($scope.currentModal === 6) {
          storeAttributes['survey_current_pos_pros_and_cons'] = $('#modal-6').find('textarea').val();
          storeAttributes['survey_need_migration'] = JSON.stringify($scope.answers.needToMigrate);
        }

        var url = $rootScope.api + '/api/v2/stores/' + $scope.storeId;
        $http.put(url, { store_attributes: storeAttributes }, { headers: { 'Content-Type': 'application/json' } })
          .success(function (data) {
          })
          .error(function (err) {
            console.error(err);
          });
        // redirect to activating page
        if ($scope.currentModal === 6) {
          $state.go('app.dashboard.activating');
        } else {
          $scope.currentModal++;
          slider.slide(String($scope.currentModal));
        }
      }
    };
    $scope.modal5Continue = function () {
      if ($scope.inputTaxes.taxes.length
        && $scope.filled()
        && $scope.checkTaxRatesFormat($scope.inputTaxes.taxes)) {

        $scope.compileTaxes();
        var taxes = $scope.taxes;

        var url = $rootScope.api + '/api/v2/stores/' + $scope.storeId;
        $http.put(url, { store_tax_options: taxes }, { headers: { 'Content-Type': 'application/json' } })
          .success(function (data) {
          })
          .error(function (err) {
            console.error(err);
          });

        $scope.currentModal++;
        slider.slide(String($scope.currentModal));
      }
    };
    $scope.checkTaxRatesFormat = function (taxes) {
      for (var i = 0; i < taxes.length; i++) {
        var taxRate = taxes[i].rate;
        var regex1 = /^[0-9]{1,2}.[0-9]{1,2}%$/;
        var regex2 = /^[0-9]{1,2}%$/;

        if (!regex1.test(taxRate) && !regex2.test(taxRate)) {
          taxes[i].invalid = true;
          return false;
        }
      }
      return true;
    };
    $scope.compileTaxes = function () {
      $scope.taxes = [];
      for (var i = 0; i < $scope.inputTaxes.taxes.length; i++) {
        $scope.taxes.push({
          name: $scope.inputTaxes.taxes[i].name,
          rate: Number($scope.inputTaxes.taxes[i].rate.slice(0, -1) / 100),
          default: $scope.inputTaxes.default === i
        });
      }
    };

    // #modal-1
    $scope.searchedStore = {
      country: 'US'
    };

    // MODAL-2 STUFF
    // google maps
    var initializeMap = function (stores) {

      var lat = Number(stores[0].lat);
      var lng = Number(stores[0].lng);

      var mainLatLng = new google.maps.LatLng(lat, lng);
      var mapOptions = {
        zoom: 15,
        center: { lat: lat, lng: lng },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false
      };
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      // main marker
      $scope.mainMarker = new RichMarker({
        position: mainLatLng,
        map: $scope.map,
        content: '<div class="main-marker"><div class="circle"></div></div>',
        shadow: 'none'
      });
      // other markers
      for (var i = 0; i < stores.length; i++) {
        var smallMarker = new RichMarker({
          position: new google.maps.LatLng(Number(stores[i].lat), Number(stores[i].lng)),
          map: $scope.map,
          content: '<div class="small-marker"><div class="circle"></div></div>',
          shadow: 'none'
        });
      }
    };
    var initializeEmptyMap = function () {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: $scope.searchedStore.zip }, function (data) {
        // add NYC coordinates for default
        var lat = data[0].geometry.location.A || 40.75;
        var lng = data[0].geometry.location.F || -73.98;
        var mainLatLng = new google.maps.LatLng(lat, lng);
        var mapOptions = {
          zoom: 15,
          center: { lat: lat, lng: lng },
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          scrollwheel: false,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      });
    };
    // google maps async load hack

    $scope.$on('$destroy', function () {
      window.initializeWelcomeMap = null;
    });

    // to fix: manual switching of stores
    $scope.selectStore = function (store) {
      $scope.selectedStore = store;
      if (store) {
        var latLng = new google.maps.LatLng(Number(store.lat), Number(store.lng));
        $scope.mainMarker.setPosition(latLng);
        $scope.map.setCenter(latLng);
      }
    };
    $scope.searchStore = function (store, from1) {
      if (from1) {
        $scope.modal2Loading = true;
        $scope.modal2LoadingMap = true;
      }

      // call store search API
      var url = $rootScope.api + '/api/v2/store-search?title=' + store.store_name +
        '&zipcode=' + store.zip + '&phone=' + store.phone + '&country=' + store.country +
        '&client_id=' + $rootScope.clientId + '&client_secret=' + $rootScope.clientSecret;
      $http.get(url)
        .success(function (data) {
          $scope.suggestedStores = data.data;
          $.getScript($rootScope.googleMaps + '&callback=initializeWelcomeMap');
          // finished loading
          if (from1) {
            $scope.modal2Loading = false;
            $scope.modal2LoadingMap = false;
          }
        })
        .error(function (err) {
          console.error(err);
        });
    };

    $scope.addTaxRate = function () {
      $scope.inputTaxes.taxes.push({ rate: '0.00%', default: false })
    };
    $scope.removeTaxRate = function (i) {
      $scope.inputTaxes.taxes.splice(i, 1);
    };
    $scope.inputTaxes = {
      taxes: [
        { name: 'Tax Free', rate: '0.00%', default: false },
        { name: 'New York Tax Rate', rate: '8.75%', default: true }
      ],
    };
    $scope.inputTaxes.default = 1;

    // MODAL-6
    $('form').submit(false);
    // 'questionnaire' answers
    $scope.answers = { needToMigrate: {} };
    // hard-coded select options
    $scope.locationNumbers = AnswersOptions.locationNumbers;
    $scope.uniqueSKUs = AnswersOptions.uniqueSKUs;
    $scope.hearAbouts = AnswersOptions.hearAbouts;
    $scope.businessTypes = AnswersOptions.businessTypes;
    $scope.barcodePercentages = AnswersOptions.barcodePercentages;
    $scope.cardAcceptances = AnswersOptions.cardAcceptances;
    $scope.startBindos = AnswersOptions.startBindos;
    $scope.averageSalesAmounts = AnswersOptions.averageSalesAmounts;
    $scope.monthlyRevenues = AnswersOptions.monthlyRevenues;
    $scope.usingSinces = AnswersOptions.usingSinces;
    $scope.registerNumbers = AnswersOptions.registerNumbers;
    $scope.migrates = AnswersOptions.migrates;

    $scope.resp_wrap = null;
    $scope.item_wrap = 'customer';

  }
}
export const AnswersOptions = {
  locationNumbers: [
    'Not Open Yet',
    '1 Store',
    '2-5 Stores',
    '6-10 Stores',
    '11-50 Stores',
    'Over 50 Stores'
  ],
  uniqueSKUs: ['Less than 50', '50-1000', '1000-10000', '10000+'],
  hearAbouts: [
    'Internet Search',
    'Mail',
    'Merchant Referral',
    'Customer Referral',
    'Partner Referral',
    'Press',
    'Radio Ad',
    'Social Media Site',
    'Magazine Ads',
    'Trade Show',
    'Word of Mouth'
  ],
  businessTypes: [
    'Pet Stores',
    'Home Furnishing Stores',
    'Hardware Stores',
    'Convenience Stores',
    'Clothing Stores',
    'Electronics Stores',
    'Pharmacies',
    'Beer, Wine, and Liquor Stores',
    'Sporting Goods Stores',
    'Hobby, Toy, and Game Shops',
    'Barber and Beauty Shops',
    'Gift Shops',
    'Jewelry Shops',
    'Other Retail Shops',
    'Service Businesses'
  ],
  barcodePercentages: ['Less than 10%', '10-50%', '50%+'],
  cardAcceptances: [
    'Yes - I would need credit card processing',
    'Yes - I already have credit card processing',
    'No - I only accept cash'
  ],
  startBindos: ['Today', 'In a week', 'In a month', 'In a few months', 'Not planned yet'],
  averageSalesAmounts: ['Less than $20', '$21-$50', 'Over $50'],
  monthlyRevenues: ['Less than $1000', '$1,000-$10,000', '$10,001-$50,000', 'Over $50,000'],
  usingSinces: ['Less than 1 year', '1-3 years', '3+ years'],
  registerNumbers: ['1-2', '3-5', '6-10', '10+'],
  migrates: ['Inventory', 'Sales', 'Customers', 'Gift Cards', 'Others']
}

export function inputPhone() {

  var VALID_PHONE_LENGTH = 10;

  var formatPhone = function (phoneNumber) {
    if (phoneNumber.length === 0 || !phoneNumber) {
      return '';
    } else if (phoneNumber.length <= 3) {
      return '(' + phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return '(' + phoneNumber.substr(0, 3) + ') ' + phoneNumber.substr(3, phoneNumber.length - 3);
    }

    // weird final substring
    return '(' + phoneNumber.substr(0, 3) + ') ' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6, 3);
  };

  var extractNumbersFrom = function (ngModel) {
    return (ngModel.$modelValue || '').replace(/\D/g, '');
  };

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$setValidity('phoneNumber', false);
      element.on('keypress', function () {
        scope.$apply(function () {
          var numbers = extractNumbersFrom(ngModel);
          ngModel.$setViewValue(formatPhone(numbers));
          ngModel.$render();

          var valid = extractNumbersFrom(ngModel).length == VALID_PHONE_LENGTH;
          ngModel.$setValidity('phoneNumber', valid);
        });
      });

    }
  };

}

export function inputLimit() {

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$setValidity('inputLimit', false);
      element.on('input', function () {
        scope.$apply(function () {
          var limit = parseInt(attrs.bdLimit || 999);
          var trimmedString = (ngModel.$modelValue || '').substr(0, limit);
          ngModel.$setViewValue(trimmedString);
          ngModel.$render();
          ngModel.$setValidity('inputLimit', trimmedString.length == limit);
        });
      });
    }
  };
}
