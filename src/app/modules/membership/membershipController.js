export class MembershipController {
  constructor(MembershipFactory, $scope, $rootScope, $state, DashboardFactory, FormatterFactory, gettextCatalog, $stateParams) {
    'ngInject';

    var statusObj = {};
    var associatesObj = {};

    $scope.title = 'Membership Levels';

    $scope.editPermission = true;

    // ROUTE
    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.api + '/api/v2/stores/' + store_id + '/membership_levels';

    var titleFormatter = function(row, cell, value, columnDef, dataContext) {
      return '<a href="' + store_id + '/membership/'+ dataContext.id+'">' + dataContext.title + '</a>';
    };

    $scope.columns = [
      {field: 'title', name: gettextCatalog.getString('Title'), ratio: '50%', formatter: titleFormatter, pdfFormatter: 'raw'},
      {field: 'created_at',name: gettextCatalog.getString('Created At'), ratio: '50%', formatter: FormatterFactory.dateFormatter}
    ];
    $scope.actions = [
      ['View', function(item) {
        $state.go('app.dashboard.membership.view', { store_id: store_id, id: item.id});
      }],
      ['Delete', function(item) {
        if(!confirm('Do you really want to delete this item?')) return false;
        $scope.loadingGrid = true;
        MembershipFactory.deleteMembership(item.id)
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

    // HACKS
    //$scope.objectWrap = 'membership_levels';

  }
}

export class MembershipViewController {
  constructor($stateParams, $scope, MembershipFactory, $state) {
    'ngInject';

    $scope.editMode = false;
    $scope.editPermission = true;
    $scope.section = "overview";
    var _membershipCache = {};
    MembershipFactory.getMembership($stateParams.id).then(function(res) {
      var data = res.data;

      $scope.membership = data.membership_level;
    });

    $scope.bottomActions = [
      ['Cancel', function() {
        if(confirm('Discard all changes?')) {
          $scope.editMode = false;
          angular.copy(_membershipCache, $scope.membership);
        }
      }, false],
      ['Save', function() {
        if ( !$scope.myForm.$valid ){
          alert('Some values are invalid. Please check again.');
          return
        }

        MembershipFactory.updateMembership($stateParams.id, $scope.membership).success(function() {
            $state.go($state.current.name, $stateParams, {reload: true});
          }
        ).error(function(err) {
          $scope.errorMessage = err.message || 'Error when saving';
        });
      }, true]
    ];

    $scope.enableEditMode = function() {
      $scope.editMode = true;
      angular.copy($scope.membership, _membershipCache);
    };

  }
}

export class MembershipNewController {
  constructor($stateParams, $scope, MembershipFactory, $state) {
    'ngInject';

    $scope.editMode = true;
    $scope.editPermission = true;
    $scope.section = "overview";
    $scope.membership = {};
    var _membershipCache = {};
    $scope.bottomActions = [
      ['Cancel', function() {
        if(confirm('Discard all changes?')) {
          $scope.editMode = false;
          angular.copy(_membershipCache, $scope.membership);
        }
      }, false],
      ['Save', function() {
        if ( !$scope.myForm.$valid ){
          alert('Some values are invalid. Please check again.');
          return
        }
        MembershipFactory.createMembership($scope.membership).success(function(res) {


          var data = res.membership_level;
          $state.go('app.dashboard.membership.view', { store_id: $stateParams.store_id, id: data.id});
        }).error(function(err) {
          $scope.errorMessage = err.message || 'Error when saving';
        });


      }, true]
    ];

    $scope.enableEditMode = function() {
      $scope.editMode = true;

    };

  }
}
