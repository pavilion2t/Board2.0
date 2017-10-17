export function gridFilter($http, $window, $state, $stateParams, gettextCatalog) {
  'ngInject';

  return {
    restrict: 'E',
    scope: false,    // just use parent scope at the moment
    templateUrl: 'app/shared/grid/grid-filter.html',
    // after compilation
    link: function (scope, elem, attrs) {
      // SAVED SEARCHES FUNCTIONALITY
      scope.translate = function (str) {
        return gettextCatalog.getString(str);
      };

      scope.currentStateName = $state.current.name;
      scope.savedFilters = JSON.parse(localStorage.getItem('savedFilters'));
      // disgusting shit - but needed
      if (!scope.savedFilters) {
        scope.savedFilters = {};
      }
      if (!scope.savedFilters[scope.currentStateName]) {
        scope.savedFilters[scope.currentStateName] = {};
      }
      scope.currentPageSavedFilters = scope.savedFilters[scope.currentStateName];
      scope.$watchCollection('currentPageSavedFilters', function (newObj, old) {
        localStorage.setItem('savedFilters', JSON.stringify(scope.savedFilters));
      });
      scope.$watchCollection('newFilters', function (newObj, old) {

        _.each(scope.newFilters, function (filter) {


          if (filter.column && filter.column.selectOptions) {
            _.each(filter.column.selectOptions, function (option) {
              var numVal = Number(option.value);
              var filterVal = Number(filter.value);
              if ((option.value === filter.value) || ( numVal === filterVal )) {
                filter.optionValue = option;
              }
            });
          }
        });
      });
      scope.changeOption = function (filter) {
        filter.value = filter.optionValue.value;
      };


      scope.getNumberOfFilters = function () {
        if (scope.savedFilters && scope.currentPageSavedFilters) {
          return Object.keys(scope.currentPageSavedFilters).length;
        } else {
          return 0;
        }
      };

      scope.filterDateOptions = {
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true
      };
      scope.filterText = {
        contain: 'contains',
        equal: 'is',
        between: 'is between',
        date_equal: 'is on',
        date_between: 'is from',
        options: 'is'
      };

      var cloneFilters = function (oldFilters) {
        var newFilters = _.map(oldFilters, function (filter) {
          return _.clone(filter);
        });
        // add default empty filters
        var _reducer = function (memo, filter) {
          return memo || (filter.column === scope.filterColumns[i]);
        }
        if (!$stateParams.filters) {
          for (var i = 0; i < scope.filterColumns.length; i++) {
            if (scope.filterColumns[i].defaultFilter) {
              if (!_.reduce(newFilters, _reducer, false)) {
                if (scope.filterColumns[i].types && scope.filterColumns[i].types.length === 1) {
                  newFilters.push({ column: scope.filterColumns[i], condition: scope.filterColumns[i].types[0] });
                } else {
                  newFilters.push({ column: scope.filterColumns[i] });
                }
              }
            }
          }
        }
        return newFilters;
      };

      scope.addFilter = function () {
        scope.newFilters.push({});
      };

      scope.setCondition = function (filter) {
        try {
          if (filter.column.types.length === 1) {
            filter.condition = filter.column.types[0]
          }
          filter.value = null;
        } catch (e) {
        }
      }

      scope.removeFilter = function (i) {
        scope.newFilters.splice(i, 1);
      };

      scope.applyFilters = function () {
        scope.defaultApplyFilters(false);
      };

      scope.defaultApplyFilters = function (refreshing) {
        // prune incomplete filters
        var newFilters = _.filter(scope.newFilters, function (filter, i) {
          if (!filter.condition || !filter.column) {
            return false;
          }
          if ((filter.condition === 'contain' || filter.condition === 'equal') && !filter.value) {
            return false;
          }
          if ((filter.condition === 'between' || filter.condition === 'date') && (!filter.from || !filter.to)) {
            return false;
          }
          return true;
        });

        if (scope.defaultFilters) {
          newFilters = newFilters.concat(scope.defaultFilters);
        }

        var filterArray = _.map(newFilters, function (filter, i) {
          var value = filter.column.formatter ? filter.column.formatter(filter.value) : filter.value;
          var from = filter.column.formatter ? filter.column.formatter(filter.from) : filter.from;
          var to = filter.column.formatter ? filter.column.formatter(filter.to) : filter.to;

          if (filter.condition === 'between' || filter.condition === 'date_between') {
            return filter.column.field + '__between__' + from + '__' + to;
          } else if (filter.condition === 'date_equal' || filter.condition === 'options') {
            return filter.column.field + '__equal__' + value;
          } else {
            return filter.column.field + '__' + filter.condition + '__' + value;
          }
        });
        var filterParam = filterArray.length ? filterArray.join('____') : null

        var params = { page: scope.pageNumber, count: scope.rowCount, filters: filterParam };
        $state.go($state.current.name, params);
      };

      scope.toggleFilters = function () {
        scope.isShowingFilters = !scope.isShowingFilters;
        if (!scope.isShowingFilters) {
          scope.newFilters = cloneFilters(scope.filters);    // cancel unsaved data
        }
      };
      scope.saveFilters = function () {
        if (scope.savedFilterSetName) {
          scope.currentPageSavedFilters[scope.savedFilterSetName] = _.cloneDeep(scope.newFilters);
          scope.savedFilterSetName = null;
          scope.isSavingFilters = false;
        } else {
          scope.saveFiltersErrorMessage = 'Please enter a name for the filter set';
        }
      };
      scope.applySavedFilters = function (filters) {
        scope.newFilters = filters;
        scope.applyFilters();
      };
      scope.removeSavedFilters = function (name) {
        delete scope.currentPageSavedFilters[name];
      };
    }
  }
}
