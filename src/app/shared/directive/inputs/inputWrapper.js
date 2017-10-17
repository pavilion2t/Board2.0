export function inputWrapper() {
  return {
    restrict: 'EA',
    transclude:true,
    replace: true,
    scope: {
      type: '@type',
      title: '@title',
      class: '@class',
      model: '=ngModel',
      disabled: '=ngDisabled',
      readonly: '=ngReadonly'
    },
    templateUrl: 'app/shared/directive/inputs/input-wrapper.html',
    link: function(scope, elem, attrs) {

      scope.checkIfInvalid = function($event) {
        scope.isInvalid = angular.element($event.currentTarget).hasClass('ng-invalid');
      };
    }
  };
}
