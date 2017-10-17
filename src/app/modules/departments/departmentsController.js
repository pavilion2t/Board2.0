export class DepartmentsController {
  constructor(ngDialog, CommonFactory, $rootScope, $scope, $timeout, $state, DepartmentFactory, DashboardFactory) {
    'ngInject';

    $scope.title = 'Departments';

    // keep track of diffs
    $scope._deletedDepts = [];
    $scope._deptDiffs = {};

    $scope.editPermission = DashboardFactory.getCurrentEditPermission('inventory');

    $scope.hasChanged = false;
    $scope.$watchCollection('_deletedDepts', function(newArr) {
      if(newArr.length) {
        $scope.hasChanged = true;
      }
    });
    $scope.$watchCollection('_deptDiffs', function(newObj) {
      if(Object.keys(newObj).length) {
        $scope.hasChanged = true;
      }
    });

    $scope.isLoadingList = true;
    DepartmentFactory.get()
      .success(function(data) {

        if(data.length < 1) {
          return
        }

        var departments = _.map(data, function(item) { return item.department; });

        var _depts = _.sortBy(_.cloneDeep(departments), function(dept) {
          return dept.depth;
        });

        // New Tree Node Simple Walk


        // 1. 2 loops to walk through the list, set up children relationship
        _.each(departments, function(dept) {
          dept._children = [];
          _.each(departments, function(dept2) {
            if ( dept.id === dept2.parent_id ) {
              dept._children.push(dept2);
            }
          });
        });

        // 2. If node is not on top level, remove it, push to new array.
        var newDeptments = [];
        _.each(departments, function(dept, i) {
          if ( dept.parent_id === null ){
            newDeptments.push(dept);
          }
        });

        $scope.listedDepartments = newDeptments;

        // $scope.departments for <select>
        $scope.departments = CommonFactory.sortAndTreeDepartment(departments);
        //$scope.departments.unshift({display: '(None)', parent_id: 0});
        $scope.isLoadingList = false;
      })
      .error(function(err) {
        console.error(err);
        $scope.errorMessage = err.message;
        $scope.isLoadingList = false;
      });

    $scope.sortableOptions = {
      connectWith: ".department__children",
      receive: function(e, ui) {
        var dept = ui.item.department;
        var oldParent = ui.sender.scope().department;
        $timeout(function() {
          var newParent = $rootScope.newParent;
          delete $rootScope.newParent;

          dept.parent_id = newParent ? newParent.id : null;
          if(!$scope._deptDiffs[dept.id]) $scope._deptDiffs[dept.id] = {};
          $scope._deptDiffs[dept.id].name = dept.name;
          $scope._deptDiffs[dept.id].parent_id = dept.parent_id;
        }, 200);

        $scope.$apply(function() {
          $scope.isExpandingLists = false;
        });

      },
      start: function(e, ui) {
        ui.item.startPos = ui.item.index();
        ui.item.department = ui.item.scope().department;
        $scope.$apply(function() {
          $scope.isExpandingLists = true;
        });
      },
      stop: function(e, ui) {
        $scope.$apply(function() {
          $scope.isExpandingLists = false;
        });
      },
    };

    $scope.createNewDepartment = function() {
      ngDialog.open({
        template: 'app/modules/departments/form.html',
        controller: 'DepartmentFormController',
        data: {
          selectDepartments:$scope.departments,
          type: 'new'
        },
        className: 'ngdialog-theme-default'
      })
        .closePromise.then(function (response) {
        var data = response.value;
        if(!data ||
          data === "$closeButton" ||
          data === "$document") {
          return
        }
        _saveNewDepartment(data);
      });
    };

    var _saveNewDepartment = function(newDepartment) {
      DepartmentFactory.create(newDepartment)
        .success(function(data) {
          $state.reload();
        })
        .error(function(err) {
          $scope.createErrorMessage = err.message;
          $scope.isSavingEntries = false;
        });
    };
    //
    $scope.discardChanges = function() {
      $state.go($state.current.name, {}, { reload: true });
    };
    $scope.saveChanges = function() {
      var promises = [];
      _.each($scope._deptDiffs, function(item, key) {
        promises.push(DepartmentFactory.update(key, item));
      });
      _.each($scope._deletedDepts, function(item, i) {
        promises.push(DepartmentFactory.remove(item));
      });

      if(promises.length === 0) {
        return $state.go($state.current.name, {}, { reload: true });
      }

      var failed = false;
      // sequential resolution - slow but works
      var resolve = function() {
        promises[0].then(
          function() {
            promises.shift();
            if(promises.length) {
              resolve();
            } else {
              $state.go($state.current.name, {}, { reload: true });
            }
          },
          function(err) {
            promises.shift();
            console.error(err);
            if(promises.length) {
              resolve();
            } else {
              $state.go($state.current.name, {}, { reload: true });
            }
          }
        );
      };
      resolve();
    };

  }
}

export class DepartmentFormController {
  constructor($scope) {
    'ngInject';

    $scope.newDepartment = $scope.ngDialogData.department || { parent_id: 0 };

    $scope.selectDepartments = $scope.ngDialogData.selectDepartments;

    if ($scope.ngDialogData.type === 'new') {
      $scope.title = 'New Department';
    } else if ($scope.ngDialogData.type === 'edit') {
      $scope.title = "Edit Department";
    }

    $scope.save = function (newDepartment) {
      if (!newDepartment.name) {
        return
      }
      $scope.closeThisDialog(newDepartment);
    };
  }
}

export function listedDepartment(DepartmentFactory, DashboardFactory, ngDialog, $rootScope, $compile, $state) {
  'ngInject';

  return {
    restrict: 'E',
    scope: {
      isExpandingLists: '=expanding',
      department: '=department',
      departments: '=departments',
      listedDepartments: '=listedDepartments',
      sortableOptions: '=sortableOptions',
      deletedDepartments: '=deletedDepartments',
      diffs: '=diffs',
      saveChanges: '&'
    },
    templateUrl: 'app/modules/departments/listed-department.html',
    link: function (scope, elem, attrs) {

      var store_id = scope.department.store_id;
      try {
        scope.storeTitle = DashboardFactory.findById(store_id).title;
      } catch (e) {
        scope.storeTitle = '';
      }

      scope.isEditable = (DashboardFactory.getStoreId() === store_id);

      // ------------------------------------
      // not sure what is this for
      if (scope.department) {
        scope.$watchCollection('department._children', function (newObj, old) {
          if (newObj.length > old.length) {
            // fuck Angular
            $rootScope.newParent = scope.department;
          }
        });
      }
      // ------------------------------------

      scope.editDepartment = function () {
        // ------------------------------------
        // prevent select self as parent in edit        var childrenIds = []

        var childrenIds = [];

        var getDepartmentChildrenIds = (department) => {
          if (department._children) {
            var ids = _.map(department._children, function (child) {
              return child.id;
            });

            childrenIds = childrenIds.concat(ids)

            _.each(department._children, (department) => {
              getDepartmentChildrenIds(department)
            })
          }
        }
        getDepartmentChildrenIds(scope.department);

        var selectDepartments = _.compact(_.map(scope.departments, (dept) => {
          if (dept.id !== scope.department.id && !_.include(childrenIds, dept.id)) {
            return dept
          } else {
            return null
          }
        }));
        // ------------------------------------

        ngDialog.open({
          template: 'app/modules/departments/form.html',
          controller: 'DepartmentFormController',
          data: {
            department: _.cloneDeep(scope.department),
            selectDepartments: selectDepartments,
            type: 'edit'
          },
          className: 'ngdialog-theme-default'
        })
          .closePromise.then(function (response) {
          var data = response.value;
          if (!data ||
            data === "$closeButton" ||
            data === "$document") {
            return
          }
          _saveEditedDepartment(data);
        });
      };
      scope.editTaxOptions = function () {
        ngDialog.open({
          template: 'app/shared/directive/tax_options/tax_options.html',
          controller: 'TaxOptionsSelectController',
          data: {
            selectedOptionIds: scope.department.tax_option_ids,
          },
          className: 'ngdialog-theme-default ngdialog-theme-mega'
        })
          .closePromise.then(function (response) {
          var data = response.value;
          if (!data ||
            data === "$closeButton" ||
            data === "$document") {
            return
          }
          scope.department.tax_option_ids = data
          var deptUpdate = {
            name: scope.department.name,
            tax_option_ids: scope.department.tax_option_ids,
            parent_id: scope.department.parent_id,
          }
          DepartmentFactory
            .update(scope.department.id, deptUpdate)
        });
      };

      var _saveEditedDepartment = function (editedDepartment) {
        if (editedDepartment.name) {
          var newDept = _.cloneDeep(editedDepartment);
          // convert parent ID format
          if (!newDept.parent_id) {
            newDept.parent_id = null;
          } else {
            newDept.parent_id = Number(newDept.parent_id);
          }
          // CHANGE CASES
          if (newDept.name === scope.department.name && newDept.parent_id === scope.department.parent_id) {
            // no change at all
          } else if (newDept.name !== scope.department.name && newDept.parent_id === scope.department.parent_id) {
            // only change name
            if (!scope.diffs[newDept.id]) scope.diffs[newDept.id] = {};
            scope.department.name = newDept.name;
            scope.diffs[newDept.id].name = newDept.name;
          } else {
            elem.detach();
            // change parent id
            // see if name changed first
            if (!scope.diffs[newDept.id]) scope.diffs[newDept.id] = {};
            scope.department.name = newDept.name;
            scope.diffs[newDept.id].name = newDept.name;

            if (newDept.parent_id === null) {
              scope.listedDepartments.push(scope.department);
              scope.department.parent_id = null;

              scope.diffs[newDept.id].parent_id = null;
            } else {
              // look for parent
              var lookForParent = function (targetArray) {
                for (var i = 0; i < targetArray.length; i++) {
                  if (targetArray[i].id === newDept.parent_id) {
                    return targetArray[i];
                  } else if (targetArray[i]._children) {
                    var childrenResult = lookForParent(targetArray[i]._children);
                    if (childrenResult) {
                      return childrenResult;
                    }
                  }
                }
                return null;
              };
              var parent = lookForParent(scope.listedDepartments);
              if (parent) {
                parent._children.push(scope.department);
                scope.department.parent_id = newDept.parent_id;
                scope.diffs[newDept.id].parent_id = newDept.parent_id;
              } else {
                scope.department.parent_id = null;
                scope.listedDepartments.push(scope.department);
                scope.diffs[newDept.id].parent_id = null;
              }
            }
          }
          scope.isEditingDepartment = false;
          scope.saveChanges();
          return
        }
      };

      scope.editWorkflow = function () {
        ngDialog.open({
          template: 'app/shared/directive/select_workflow/select_workflow.html',
          controller: 'WorkflowSelectController',
          data: {
            selected: scope.department.workflow ? scope.department.workflow.id : null,
          },
          className: 'ngdialog-theme-default ngdialog-theme-mega'
        })
          .closePromise.then(function (response) {
          var data = response.value;
          if (!(data && data.id)) {
            return
          }
          scope.department.workflow = Object.assign({}, data);
          var deptUpdate = {
            name: scope.department.name,
            parent_id: scope.department.parent_id,
            workflow_id: scope.department.workflow.id
          };
          DepartmentFactory
            .update(scope.department.id, deptUpdate)
        });
      };

      scope.removeDepartment = function () {
        elem.detach();
        scope.deletedDepartments.push(scope.department.id);
      };

      var childrenHTML = "<div class='department__children' ng-class='{ _expanded: isExpandingLists, _empty: !department._children.length }' ui-sortable='sortableOptions' expanding='isExpandingLists' ng-model='department._children'>" +
        "<div ng-repeat='department in department._children'><listed-department department='department' departments='departments' listed-departments='listedDepartments' diffs='diffs' sortable-options='sortableOptions' expanding='isExpandingLists' deleted-departments='deletedDepartments'></listed-department></div></div>";
      elem.find('.list__department').append(childrenHTML);
      $compile(elem.find('.department__children'))(scope);
    }
  };
}
