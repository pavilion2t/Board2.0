export function metricsDetail() {
  return {
    restrict: 'EA',
    templateUrl: 'app/modules/summary/mertics-detail.html',
    replace: true,
    scope: {
      title: '=',
      changes: '=',
      amount: '=',
      margin: '=',
    },
    link: function(scope, elem, attrs){

    }
  };
}

export function summaryDatePicker() {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {
    }
  }
}
