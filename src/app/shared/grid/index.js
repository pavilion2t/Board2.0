import { editableGrid } from './editableGrid'
import { gridBody } from './gridBody'
import { gridEmpty, emptyImage } from './gridEmpty'
import { gridFilter } from './gridFilter'
import { gridImport } from './gridImport'
import { gridPagination } from './gridPagination'
import { gridRowCount } from './gridRowCount'


export default angular
  .module('grid', [])
  .directive('editableGrid', editableGrid)
  .directive('gridBody', gridBody)
  .directive('gridEmpty', gridEmpty)
  .directive('emptyImage', emptyImage)
  .directive('gridFilter', gridFilter)
  .directive('gridImport', gridImport)
  .directive('gridPagination', gridPagination)
  .directive('gridRowCount', gridRowCount)
