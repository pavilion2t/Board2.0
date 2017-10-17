export function inputRadio() {
  return {
    restrict: 'E',
    scope: {
      label: '@label',
      name: '@name',
      value: '=ngValue',
      model: '=ngModel',
      disabled: '=ngDisabled',
      ngChange: '&ngChange',
      ngClick: '&ngClick',
    },
    templateUrl: 'app/shared/directive/inputs/input-radio.html',
  };
}
