
import { DepartmentsController, DepartmentFormController, listedDepartment } from './departmentsController'
import { DepartmentFactory } from './departmentFactory'

export default angular
  .module('departments', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.departments', { url: '/departments?page&count', templateUrl: 'app/modules/departments/list_departments.html', controller: 'DepartmentsController' })
  })
  .controller('DepartmentsController', DepartmentsController)
  .controller('DepartmentFormController', DepartmentFormController)
  .directive('listedDepartment', listedDepartment)
  .factory('DepartmentFactory', DepartmentFactory)
