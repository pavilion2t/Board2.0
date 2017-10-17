import { RecursionHelper } from './angular-recursion'
import { AuthFactory } from './authFactory'
import { BackEndFactory } from './backendFactory'
import { CommonFactory } from './commonFactory'
import { currencymap } from './currencymap'
import { DashboardFactory } from './dashboardFactory'
import { ExportFactory } from './exportFactory'
import { FormatterFactory } from './formatterFactory'
import { formDataObject } from './formDataObject'
import { myHttpInterceptor } from './httpFactory'
import { ImportFactory } from './importFactory'
import { productGraphicFactory } from './productGraphicFactory'

export default angular
  .module('factory', [])
  .factory('RecursionHelper', RecursionHelper)
  .factory('AuthFactory', AuthFactory)
  .factory('BackEndFactory', BackEndFactory)
  .factory('CommonFactory', CommonFactory)
  .constant('currencymap', currencymap)
  .factory('DashboardFactory', DashboardFactory)
  .factory('ExportFactory', ExportFactory)
  .factory('FormatterFactory', FormatterFactory)
  .factory('formDataObject', formDataObject)
  .factory('myHttpInterceptor', myHttpInterceptor)
  .factory('ImportFactory', ImportFactory)
  .factory('productGraphicFactory', productGraphicFactory)

