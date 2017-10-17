export function inputFile() {
  return {
    restrict: 'E',
    scope: {
      file: '=file'
    },
    templateUrl: 'app/shared/directive/inputs/input-file.html',
  };
}

// action when user has chosen file
export function inputFileRead() {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {

      scope.removeFile = function() {
        elem.val('');
        delete scope.file;
      };
      elem.bind('change', function(event) {
        scope.$apply(function() {
          var file = event.target.files[0];
          scope.file = file;
        });
      });
    }
  };
}
