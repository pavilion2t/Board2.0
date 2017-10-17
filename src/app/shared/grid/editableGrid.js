export function editableGrid($rootScope, $sce) {
  'ngInject';
  return {
    restrict: 'E',
    scope: {
      columns: '=columns',
      columnsForExtraData: '=columnsForExtraData',
      data: '=data',
      editMode: '=editMode',
      hideRemove: '=',
      customRemove: '=',
      removeCallback: '=?',
      groupingField: '=groupingField'
    },
    templateUrl: 'app/shared/grid/editable-grid.html',
    link: function(scope, elem, attrs) {
      scope.toTrustedHtml = function(html) {
        return $sce.trustAsHtml(html);
      };


      scope.defaultPattern = /^[0-9]+(\.[0-9])?$/i;

      scope.remove = function(i, item) {

        if ( scope.customRemove ) {
          item.deleted = !item.deleted;
        }
        else {
          if (scope.removeCallback && typeof scope.removeCallback === 'function') {
            scope.removeCallback(i, item)
          } else {
            scope.data.splice(i, 1)
          }
        }
      }
    }
  };
}
