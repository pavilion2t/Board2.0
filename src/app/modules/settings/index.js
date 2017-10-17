
import { AdditionalfeeController, AdditionalfeeNewController, AdditionalfeeViewController } from './additionalfee/additionalfeeController'
import { AdditionalfeeFactory } from './additionalfee/additionalfeeFactory'
import { myCurrency, CurrencyController } from './currency/currencyController'
import { CustomAttributesController } from './custom_attributes/customAttributesController'
import { CustomAttributesFactory } from './custom_attributes/customAttributesFactory'
import { EmailTemplateIndexController, EmailTemplateController } from './email_template/emailTemplateController'
import { EmailTemplateFactory } from './email_template/emailTemplateFactory'
import { LanguagesController } from './languages/languagesController'
import { LanguagesFactory } from './languages/languagesFactory'
import { PermissionsController } from './permissions/permissionsController'
import { PermissionsFactory } from './permissions/permissionsFactory'
import { RolesController } from './permissions/rolesController'
import { rolesFactory } from './permissions/rolesFactory'
import { PolicyController } from './policy/policyController'
import { PolicyFactory } from './policy/policyFactory'
import { RoundingBehaviorController } from './rounding_behavior/roundingBehaviorController'
import { RoundingBehaviorFactory } from './rounding_behavior/roundingBehaviorFactory'
import { CustomfieldFactory } from './customfieldFactory'
import { CustomfieldsController } from './customfieldsController'
import { iframeBaseController, iframeSettingController, colorpicker } from './iframeController'
import { IframeFactory } from './iframeFactory'
import { LineItemStatusController } from './lineItemStatusController'
import { LineItemStatusFactory } from './lineItemStatusFactory'
import { SettingsController } from './settingsController'
import { TaxOptionsController, taxOptionForm } from './taxOptionsController'
import { TaxOptionsFactory } from './taxOptionsFactory'
import { TimeSegmentController, timeSegmentRow } from './timeSegmentController'
import { TimeSegmentFactory } from './timeSegmentFactory'


export default angular
  .module('settings', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.settings', {
        url: '/settings',
        templateUrl: 'app/modules/settings/settings.html',
        controller: 'SettingsController',
        resolve: {
          departments: function ($stateParams, DashboardFactory) {
            if (!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getDepartments($stateParams.store_id);
          },
        }
      })
      .state('app.dashboard.settings.iframe', { abstract: true, url: '/iframe', templateUrl: 'app/modules/settings/iframe.html', controller: 'iframeBaseController' })
      .state('app.dashboard.settings.iframe.index', { url: '', templateUrl: 'app/modules/settings/iframe_index.html', controller: 'iframeBaseController' })
      .state('app.dashboard.settings.iframe.new', { url: '/new', templateUrl: 'app/modules/settings/iframe_new.html', controller: 'iframeBaseController' })
      .state('app.dashboard.settings.iframe.edit', { url: '/:iframe_page_id/edit', templateUrl: 'app/modules/settings/iframe_new.html', controller: 'iframeBaseController' })
      .state('app.dashboard.settings.iframe.setting', { url: '/setting', templateUrl: 'app/modules/settings/iframe_setting.html', controller: 'iframeSettingController' })

      .state('app.dashboard.settings.line-item-status', { abstract: true, url: '/line-item-status', templateUrl: 'app/modules/settings/line_item_status.html' })
      .state('app.dashboard.settings.line-item-status.index', { url: '', templateUrl: 'app/modules/settings/line_item_status_index.html', controller: 'LineItemStatusController' })

      .state('app.dashboard.settings.tax', {
        url: '/tax',
        template: '<ui-view></ui-view>',
        abstract: true,
        resolve: {
          taxOptions: function ($stateParams, TaxOptionsFactory) {
            return TaxOptionsFactory.get(null, $stateParams.store_id);
          },
        }
      })
      .state('app.dashboard.settings.tax.index', {
        url: '',
        templateUrl: 'app/modules/settings/tax_options.html',
        controller: 'TaxOptionsController'
      })
      .state('app.dashboard.settings.tax.new', {
        url: '/new',
        templateUrl: 'app/modules/settings/tax_options_new.html',
        controller: 'TaxOptionsController'
      })
      .state('app.dashboard.settings.policy', {
    	  url: '/policy',
          templateUrl: 'app/modules/settings/policy/policy.html',
          controller: 'PolicyController'
      })


      .state('app.dashboard.settings.time', {
        url: '/time',
        template: '<ui-view></ui-view>',
        abstract: true,
        resolve: {
          opening_hours: function ($stateParams, TimeSegmentFactory) {
            var timeseg = TimeSegmentFactory.get($stateParams.store_id);
            return timeseg;
          },
          timeSegments: function ($stateParams, TimeSegmentFactory) {
            var timeseg = TimeSegmentFactory.getSegments($stateParams.store_id);
            return timeseg;
          }
        }
      })
      .state('app.dashboard.settings.time.segments', {
        url: '/segments',
        templateUrl: 'app/modules/settings/time_segment.html',
        controller: 'TimeSegmentController'
      })

      .state('app.dashboard.settings.time.opening-hours', {
        url: '/opening-hours',
        templateUrl: 'app/modules/settings/opening_hours.html',
        controller: 'TimeSegmentController'
      })
      .state('app.dashboard.settings.permissions', {
        url: '/permissions',
        template: '<ui-view></ui-view>',
        abstract: true
      })
      .state('app.dashboard.settings.permissions.index', {
        url: '',
        templateUrl: 'app/modules/settings/permissions/permissions.html',
        controller: 'PermissionsController'
      })
      .state('app.dashboard.settings.currency', {
        url: '/currency',
        template: '<ui-view></ui-view>',
        abstract: true
      })
      .state('app.dashboard.settings.currency.index', {
        url: '',
        templateUrl: 'app/modules/settings/currency/currency.html',
        controller: 'CurrencyController'
      })
      .state('app.dashboard.settings.additionalfee.index', {
        url: '',
        templateUrl: 'app/modules/settings/additionalfee/additionalfee.html',
        controller: 'AdditionalfeeController'
      })
      .state('app.dashboard.settings.additionalfee.new', {
        url: '/new',
        templateUrl: 'app/modules/settings/additionalfee/additionalfee_new.html',
        controller: 'AdditionalfeeNewController'
      })
      .state('app.dashboard.settings.additionalfee.view', {
        url: '/:listing_id',
        templateUrl: 'app/modules/settings/additionalfee/additionalfee_new.html',
        controller: 'AdditionalfeeViewController'
      })

      .state('app.dashboard.settings.additionalfee', {
        url: '/additionalfee',
        template: '<ui-view></ui-view>',
        abstract: true
      })

      .state('app.dashboard.settings.rounding', {
        url: '/rounding',
        templateUrl: 'app/modules/settings/rounding_behavior/rounding_behavior.html',
        controller: 'RoundingBehaviorController'
      })

      .state('app.dashboard.settings.languages', {
        url: '/languages',
        templateUrl: 'app/modules/settings/languages/languages.html',
        controller: 'LanguagesController'
      })

      .state('app.dashboard.settings.email-template', {
        url: '/email-template',
        template: '<ui-view></ui-view>',
        abstract: true
      })
      .state('app.dashboard.settings.email-template.index', {
        url: '',
        templateUrl: 'app/modules/settings/email_template/list_email_template.html',
        controller: 'EmailTemplateIndexController'
      })

      .state('app.dashboard.settings.email-template.new', {
        url: '/new',
        templateUrl: 'app/modules/settings/email_template/email_template.html',
        controller: 'EmailTemplateController'
      })
      .state('app.dashboard.settings.email-template.view', {
        url: '/:listing_id',
        templateUrl: 'app/modules/settings/email_template/email_template.html',
        controller: 'EmailTemplateController'
      })

      .state('app.dashboard.settings.custom-attributes', {
        url: '/custom-attributes',
        templateUrl: 'app/modules/settings/custom_attributes/custom_attributes.html',
        controller: 'CustomAttributesController'
      })
  })
  .controller('AdditionalfeeNewController', AdditionalfeeNewController)
  .controller('AdditionalfeeController', AdditionalfeeController)
  .controller('AdditionalfeeViewController', AdditionalfeeViewController)
  .factory('AdditionalfeeFactory', AdditionalfeeFactory)
  .directive('myCurrency', myCurrency)
  .controller('CurrencyController', CurrencyController)
  .controller('CustomAttributesController', CustomAttributesController)
  .factory('CustomAttributesFactory', CustomAttributesFactory)
  .controller('EmailTemplateIndexController', EmailTemplateIndexController)
  .controller('EmailTemplateController', EmailTemplateController)
  .factory('EmailTemplateFactory',EmailTemplateFactory)
  .controller('LanguagesController', LanguagesController)
  .factory('LanguagesFactory', LanguagesFactory)
  .controller('PermissionsController', PermissionsController)
  .factory('PermissionsFactory', PermissionsFactory)
  .controller('RolesController', RolesController)
  .factory('rolesFactory', rolesFactory)
  .controller('PolicyController',PolicyController)
  .factory('PolicyFactory', PolicyFactory)
  .controller('RoundingBehaviorController', RoundingBehaviorController)
  .factory('RoundingBehaviorFactory', RoundingBehaviorFactory)
  .factory('CustomfieldFactory', CustomfieldFactory)
  .controller('CustomfieldsController', CustomfieldsController)
  .controller('iframeBaseController', iframeBaseController)
  .controller('iframeSettingController', iframeSettingController)
  .directive('colorpicker', colorpicker)
  .factory('IframeFactory', IframeFactory)
  .controller('LineItemStatusController', LineItemStatusController)
  .factory('LineItemStatusFactory', LineItemStatusFactory)
  .controller('SettingsController', SettingsController)
  .controller('TaxOptionsController', TaxOptionsController)
  .directive('taxOptionForm', taxOptionForm)
  .factory('TaxOptionsFactory', TaxOptionsFactory)
  .controller('TimeSegmentController', TimeSegmentController)
  .directive('timeSegmentRow', timeSegmentRow)
  .factory('TimeSegmentFactory', TimeSegmentFactory)
