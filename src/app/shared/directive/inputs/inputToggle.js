export function inputToggle() {
  return {
    restrict: 'E',
    scope: {
      label: '@label',
      model: '=ngModel',
      disabled: '=ngDisabled'
    },
    templateUrl: 'app/shared/directive/inputs/input-toggle.html',
  };
}
