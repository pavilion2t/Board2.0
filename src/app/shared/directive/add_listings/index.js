import { AddListingFactory } from './add_factory';
import { addListings, AddListings } from './add_listings'
import { addListingsByBarcode } from './add_listings_by_barcode'
import { addListingsInputSelectDepartment, addListingsInputSelectDepartmentController } from './add_listings_input_department'
import { addListingsInputSelect, addListingsInputSelectController } from './add_listings_input_select'
import { addListingsListedDepartments } from './add_listings_listed_departments'

export default angular
  .module('add_listings', [])
  .directive('addListings', addListings)
  .controller('AddListings', AddListings)
  .factory('AddListingFactory', AddListingFactory)
  .directive('addListingsByBarcode', addListingsByBarcode)
  .directive('addListingsInputSelectDepartment', addListingsInputSelectDepartment)
  .controller('addListingsInputSelectDepartment', addListingsInputSelectDepartmentController)
  .directive('addListingsInputSelect', addListingsInputSelect)
  .controller('addListingsInputSelect', addListingsInputSelectController)
  .directive('addListingsListedDepartments', addListingsListedDepartments)


