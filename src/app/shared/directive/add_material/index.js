import { addMaterial, AddMaterialFactory, AddMaterial } from './add_material'

export default angular
  .module('add_material', [])
  .directive('addMaterial', addMaterial)
  .controller('AddMaterial', AddMaterial)
  .factory('AddMaterialFactory', AddMaterialFactory)
