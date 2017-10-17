import { StoreSelect, storeSelection, StoreSelectionFactory } from './store_selection'

export default angular
  .module('store_selection', [])
  .directive('storeSelection', storeSelection)
  .controller('StoreSelect', StoreSelect)
  .factory('StoreSelectionFactory', StoreSelectionFactory)
