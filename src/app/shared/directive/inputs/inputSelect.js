export function inputSelect() {
  return {
    restrict: 'E',
    scope: {
      disabled: '=ngDisabled',
      value: '=value',
      click: '=ngClick',
      placeholder: '=placeholder'
    },
    templateUrl: 'app/shared/directive/inputs/input-select.html',
    link: function(scope, elem, attrs) {

      scope.openDialog = function(){
        if(!scope.disabled){
          scope.click();
        }

      };

      scope.$watch('disabled',function(){
        if(scope.disabled){
          scope.value = "";
        }
      });

    }
  };
}
