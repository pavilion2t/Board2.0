import { addCustomer, AddCustomer } from './add_customer'
import { AddCustomerFactory } from './add_factory'

export default angular
  .module('add_customer', [])
  .directive('addCustomer', addCustomer)
  .controller('AddCustomer', AddCustomer)
  .factory('AddCustomerFactory', AddCustomerFactory)

