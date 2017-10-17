import { header } from './header'
import { headerProfile } from './profile/headerProfile'
import { headerStoreSelector } from './store-selector/headerStoreSelector'
import { headerStoreSelectorItem } from './store-selector/headerStoreSelectorItem'

export default angular
  .module('header', [])
  .directive('header', header)
  .directive('headerProfile', headerProfile)
  .directive('headerStoreSelector', headerStoreSelector)
  .directive('headerStoreSelectorItem', headerStoreSelectorItem)

