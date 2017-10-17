import { ExternalSourcesStoreFactory } from './externalSourcesStoreFactory'
import { FactualFactory } from './factualFactory'
import { storeSearch } from './storeSearch'
import { YelpFactory } from './yelpFactory'

export default angular
  .module('external_sources', [])
  .factory('ExternalSourcesStoreFactory', ExternalSourcesStoreFactory)
  .factory('FactualFactory', FactualFactory)
  .directive('storeSearch', storeSearch)
  .factory('YelpFactory', YelpFactory)

