export class CuhkCustomReportController {
  constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
	  'ngInject';
	
		var columnDefs = [
	
	     	columnDefsFactory.dateField("date"),
	    	columnDefsFactory.standardField("company_code"),
	    	columnDefsFactory.standardField("business_area"),
	    	columnDefsFactory.standardField("store_title"),
	    	columnDefsFactory.standardField("account_code"),
	    	columnDefsFactory.standardField("account_description"),
	   		columnDefsFactory.standardField("item_text"),
	   		columnDefsFactory.standardField("assignment"),
	    	columnDefsFactory.currencyAggregateField("amount_credit"),
	    	columnDefsFactory.currencyAggregateField("amount_debit"),
	    	];
	
	  
	  $scope.columnDefs = columnDefs
	  $scope.gridOptions = {
	      enableGrouping: true
	    };
	  $scope.dataRequest = reportsFactory.reportApi.bind(this, 'cuhk_custom_report')
	  $scope.dataCallback =  function(res) {
	    return res.data.entries
	  }
	}
};