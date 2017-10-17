export function inputCheckbox() {
  return {
    restrict: 'E',
    scope: {
      label: '@label',
      model: '=ngModel',
      disabled: '=ngDisabled',
      class: '@class',
      getterSetter: '=ngGetterSetter',
    },
    templateUrl: 'app/shared/directive/inputs/input-checkbox.html',
  };
}
