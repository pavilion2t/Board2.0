export function inputDate() {
  return {
    restrict: 'E',
    scope: {
      title: '@title',
      class: '@class',
      model: '=ngModel',
      readonly: '=ngReadonly',
      disabled: '=ngDisabled',
      hideTitle: '=hideTitle'
    },
    replace: true,
    templateUrl: 'app/shared/directive/inputs/input-date.html',
    link: function(scope, elem, attrs) {
      scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true
      };
    }
  };
}
