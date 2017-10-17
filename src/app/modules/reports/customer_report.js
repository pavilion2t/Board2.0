
export class CustomerReportController {
  constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
	  'ngInject';
	
    var columnDefs = [

        columnDefsFactory.standardField("id"),
        columnDefsFactory.standardField("name"),
        columnDefsFactory.standardGroupField("membership_level"),
        columnDefsFactory.standardGroupField("gender"),
        columnDefsFactory.standardField("mobile"),
        columnDefsFactory.standardField("phone"),
        columnDefsFactory.standardField("email"),
        columnDefsFactory.standardField("billing_address"),
        columnDefsFactory.standardField("shipping_address"),
        columnDefsFactory.standardField("other_addresses"),
        columnDefsFactory.numberField("card_on_file"),
        columnDefsFactory.currencyAggregateField("store_credit"),
        columnDefsFactory.standardField("note"),
        columnDefsFactory.currencyAggregateField("total_spent"),
        columnDefsFactory.numberAggregateField("total_order"),
        columnDefsFactory.standardField("gift_card_linked"),
        columnDefsFactory.numberAggregateField("qualified_rewards"),
        columnDefsFactory.datetimeField("last_visit"),
        columnDefsFactory.datetimeField("date_created")

    ];

      $scope.gridOptions = {
                enableGrouping: true
        };
  $scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
  $scope.dataRequest = reportsFactory.analyticsv4Api.bind(this, 'customer_report')
  }
};

