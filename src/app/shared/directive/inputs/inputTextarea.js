export function inputTextarea() {
  return {
    restrict: 'E',
    scope: {
      title: '@title',
      model: '=ngModel',
      // disabled: '=ngDisabled',
      readonly: '=ngReadonly'
    },
    templateUrl: 'app/shared/directive/inputs/input-textarea.html',
  };
}
