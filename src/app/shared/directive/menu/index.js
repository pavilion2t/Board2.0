import { NavigationMenuFactory } from './menu'
import { menu } from './menu-directive'

export default angular
  .module('menu', [])
  .factory('NavigationMenuFactory',  NavigationMenuFactory)
  .directive('menu',  menu)


