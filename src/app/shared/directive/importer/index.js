import { importer, appFilereader, ImporterController } from './importer'

export default angular
  .module('importer', [])
  .directive('importer', importer)
  .directive('appFilereader', appFilereader)
  .controller('ImporterController', ImporterController)

