export function inputBirthday() {
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
    templateUrl: 'app/shared/directive/inputs/input-birthday.html',
    link: function(scope, elem, attrs, ngmodel) {
      scope.dateClick = function(){
        if ( !scope.disabled && !scope.readonly ) {
          $(elem).find('.datePicker_select').show();
        }
      };
      scope.setDate = function(){
        if ( scope.model ) {
          var values = scope.model.split('-');
          if ( values.length > 1 ) {
            scope.month = values[0];
            scope.setMonth();
            setTimeout(function(){scope.day = values[1];},0);
          }
          else {
            scope.month = '';
            scope.day = '';
          }

        }
      };
      scope.setDate();
      scope.setMonth = function(){
        var month = parseInt(scope.month);
        if ( month !== '' && month >= 1 && month <= 12 ) {
          scope.days = scope.fillNumbers(scope.daysInMonth[month-1]);
        }
      };
      scope.setMonth();
      scope.$watch('model',scope.setDate);
      scope.daysInMonth = [31,29,31,30,31,30,31,31,30,31,30,31];
      scope.changeMonth = function(){
        scope.setMonth();
        scope.changeDay();
      };
      scope.changeDay = function(){
        scope.model = scope.month+'-'+scope.day;
      };
      scope.days = [];
      scope.fillZero = function(i){
        var val = i.toString();
        if ( val.length === 1 ){
          val = '0'+val;
        }
        return val;
      };
      scope.fillNumbers = function(max){
        var arr = [];
        for ( var i = 1; i <= max; i ++ ){
          arr.push( scope.fillZero(i) );
        }

        return arr;
      };
      scope.months = scope.fillNumbers(12);
      scope.day = '';
      scope.month = '';
      scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true
      };
      $(document).click(function(e) {
        var target = e.target;
        if (!$(target).parents().is($(elem))) {
          $('.datePicker_select').hide();
        }
      });
    }
  };
}
