export function gridImport($http, $state, $q, CommonFactory) {
  'ngInject';

  return {
    restrict: 'E',
    scope: false,    // just use parent scope at the moment
    templateUrl: 'app/shared/grid/grid-import.html',
    // after compilation
    link: function(scope, elem, attrs) {
      var exitImport = function() {
        scope.uploadedFile = null;
        scope.isImporting = false;
        scope.isSavingEntries = false;

        $state.go($state.current.name, {}, { reload: true });
      };
      scope.importColumnsString = _.map(scope.importColumns, function(column) {
        return column.name;
      }).join(', ');

      // exit when click outside modal
      elem.on('click', exitImport);
      // stop closing the modal screen
      $('.import__modal').on('click', function(event) {
        event.stopPropagation();
      });

      scope.uploadCsv = function() {
        scope.isSavingEntries = true;
        var reader = new FileReader();
        // callback when reading file is done
        reader.onloadend = function() {
          var csv = reader.result;
          // work on the csv
          var items = CommonFactory.parseCsv(scope.importColumns, csv);
          var promises = _.map(items, function(item, i) {
            var data = {};
            data[scope.uploadItemKey] = item;
            return $http.post(scope.route, data);
          });

          $q.all(promises)
            .then(function() {
              exitImport();
            }, function(err) {
              scope.uploadErrorMessage = err.message;
            });
        };
        // start reading file
        reader.readAsText(scope.uploadedFile);
      };
    }
  }
}
