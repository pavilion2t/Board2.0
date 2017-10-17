import {ajaxPaginator} from './ajaxPaginator';
import {indexPaginator} from './indexPaginator';

export default angular
  .module('ajaxPaginator', [])
  .directive('ajaxPaginator', ajaxPaginator)
  .directive('indexPaginator', indexPaginator)
