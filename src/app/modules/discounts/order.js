export class discountOrderController {
  constructor($rootScope, $scope, $state, $filter, DashboardFactory, gettextCatalog, DiscountFactory, $stateParams, grid_data) {
    'ngInject';

    $scope.editPermission = DashboardFactory.getCurrentEditPermission('discount');

    $scope.cumulative = function( grid, myRow ) {

      if( myRow.entity.mix_and_match ) {
        return gettextCatalog.getString('Mix and Match');
      } else if(myRow.entity.is_advance_discount){
        return gettextCatalog.getString('Advance');
      } else{
        return gettextCatalog.getString('Regular');
      }

    };

    $scope.gridOptions = {
      rowHeight: 40,
      data: grid_data,
      enableSorting: false,
      columnDefs: [
        { field: 'name' },
        { name: gettextCatalog.getString('Type'), field: 'discount_type', cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">{{grid.appScope.cumulative(grid, row)}}</div>' },
        { field: 'percentage'}
      ],
      rowTemplate: '<div grid="grid" class="ui-grid-draggable-row" draggable="true"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'custom\': true }" ui-grid-cell></div></div>'
    };


    $scope.getTableHeight = function() {
      var rowHeight = 40; // your row height
      var headerHeight = 30; // your header height
      return {
        height: ($scope.gridOptions.data.length * rowHeight + headerHeight) + "px"
      };
    };

    var original_discounts = _.map(grid_data, function(item){
      return item.id;
    });

    $scope.gridOptions.onRegisterApi = function (gridApi) {
      gridApi.draggableRows.on.rowDropped($scope, function (info, dropTarget) {
        //use grid_data and index to change order, and save after call repriority api
        original_discounts.splice(info.fromIndex, 1);
        original_discounts.splice(info.toIndex, 0, info.draggedRowEntity.id);
      });
    };

    $scope.objectWrap = 'discount';

    $scope.bottomActions = [
      ['Cancel', function() {
        if(confirm('Discard all changes?')) {
          $state.go('app.dashboard.discounts.index', { store_id: DashboardFactory.getStoreId() });
        }
      }, false],
      ['Save', function() {
        DashboardFactory.reOrderDiscounts(original_discounts).success(function(){
          $state.go('app.dashboard.discounts.index', { store_id: DashboardFactory.getStoreId() });
        });

      }, true],
    ];

  }
}
