export class iframeBaseController {
  constructor(departments, IframeFactory, DashboardFactory, $scope, $rootScope, $sce, $state, $stateParams, ngDialog) {
    'ngInject';

    $scope.iframe_page = {};
    $scope.departments = [];
    $scope.iframeActive = DashboardFactory.getCurrentStore().iframe_active;
    $scope.iframeActivationRequested = false;
    $scope.departments = departments;
    $scope.previewIframe = false;

    $scope.deliveryTypeString = function(slug) {
      return {
        flat: 'Flat rate shipping',
        free: 'Free shipping',
        pickup: 'Pick up only',
      }[slug]
    }

    $scope.requestIframeActivation = function() {
      IframeFactory.requestIframeActivation().success(function(){
        $scope.iframeActivationRequested = true;
      });
    };


    $scope.requestIframeActivation = function() {
      IframeFactory.requestIframeActivation().success(function(){
        $scope.iframeActivationRequested = true;
      });
    };

    if(! $scope.iframeActive) {
      return
    }

    var currentStoreSlug = DashboardFactory.getCurrentStore().slug;

    var defaultIframePageValues = {
      'image_size' : 'medium',
      'btn_color' : '#73d1be',
      'btn_text_color' : '#ffffff',
      'highlight_color' : '#73d1be',
      'iframe_page_sections': [{header: '', department_ids:[]}]
    };

    IframeFactory.getIframeSetting().success(function(res){
      $scope.setting = res.data.iframe_setting;

    }).error(function(res){
      if(res.meta.code === 404) {
        $state.go('app.dashboard.settings.iframe.setting');
      } else {
        console.error(res);
      }
    });

    if ($state.current.name === "app.dashboard.settings.iframe.index") {
      IframeFactory.getIframePages().success(function(res){
        $scope.iframePages = _.map(res.data.iframe_pages, function(item) { return item; });
      });
      IframeFactory.getIframeSetting().success(function(res){
        $scope.iframeSetting = res.data.iframe_setting;
      });

    } else if ($stateParams.iframe_page_id) {
      $scope.iframePageId = $stateParams.iframe_page_id;
      IframeFactory.getIframePage($stateParams.iframe_page_id).success(function(res){
        if (res.data.iframe_page.iframe_page_sections.length > 0) {
          _.each(res.data.iframe_page.iframe_page_sections, function(iframe_page_section){
            if (iframe_page_section.department_ids_string) {
              iframe_page_section.department_ids = _.map(iframe_page_section.department_ids_string.split(","), function(num){
                return parseInt(num);
              });
              delete iframe_page_section.department_ids_string;
            }
          });
        } else {
          res.data.iframe_page = {
            iframe_page_sections: [{header: '', department_ids:[]}]
          };
        }
        _.assign($scope.iframe_page, defaultIframePageValues, res.data.iframe_page);
      });

    } else if ($state.current.name === "app.dashboard.settings.iframe.new") {
      $scope.iframePageId = null;
      _.assign($scope.iframe_page, defaultIframePageValues);
    }

    $scope.code = function(iframePageId) {

      var markup = [
        ' <iframe ',
        ' id="bindo-storefront" ',
        ' style="width: 100%; border: none;" ',
        ' src="' + $rootScope.storefront + '/#/stores/',
        currentStoreSlug + '-'+iframePageId+'"',
        '>',
        '</iframe>',
        '<script type="text/javascript" src="' + $rootScope.storefrontEmbed + '"></script>'].join('');

      return $sce.trustAsHtml(markup);
    };

    $scope.goToIndex = function() {
      $state.go('app.dashboard.settings.iframe.index');
    };

    $scope.saveIframePage = function(iframePage) {
      var promise;

      _.each(iframePage.iframe_page_sections, function(iframe_page_section){
        if (iframe_page_section.department_ids) {
          iframe_page_section.department_ids_string = iframe_page_section.department_ids.toString();
          delete iframe_page_section.department_ids;
        }
      });

      if ($state.current.name === "app.dashboard.settings.iframe.new") {
        promise = IframeFactory.createIframePage(iframePage);
      } else if ($state.current.name === "app.dashboard.settings.iframe.edit") {
        promise = IframeFactory.updateIframePage($stateParams.iframe_page_id, iframePage);
      }

      promise.success(function(res) {
        $scope.iframePageId = res.data.iframe_page.id;
        $scope.goToIndex();

        //TODO: make API support in one request
        iframePage.iframe_page_sections.forEach((section) => {
          if( section.delete ) {
            IframeFactory.deleteIframeSection(iframePage.id, section.id)
          }
        })
      });
    };

    $scope.deleteIframePage = function(id) {
      if(confirm('Are you sure you want to delete this page?')) {
        IframeFactory.deleteIframePage(id).success(function(){
          $state.go('app.dashboard.settings.iframe.index', {}, { reload: true });
        });
      }
    };

    $scope.editIframePage = function(id) {
      $state.go('app.dashboard.settings.iframe.edit', {iframe_page_id: id});
    };

    $scope.showPreview = function() {
      $scope.previewIframe = true;
    };
    $scope.closePreview = function() {
      $scope.previewIframe = false;
    };


    $scope.addSection = function(iframe_page_sections) {
      iframe_page_sections.push({header: '', department_ids:''});
    };
    $scope.removeSection = function(iframe_page_sections, iframe_page_section) {
      iframe_page_section.delete = true;
      // _.pull(iframe_page_sections, iframe_page_section);
    };
    $scope.checkSections = function(iframe_page_sections) {
      if (iframe_page_sections.length > 1 && !$scope.iframe_page.multi_iframe_page_section_layout) {
        _.each(iframe_page_sections, function(iframe_page_section, index) {
          if (index !== 0) {
            iframe_page_section.delete = true;
          }
        })
      }
    }

    $scope.viewCode = function(iframePageId){
      $scope.iframePageId = iframePageId;
      ngDialog.open({
        template: 'app/modules/settings/iframeCodePreview.html',
        scope: $scope
      });
    };

  }
}

export class iframeSettingController {
  constructor(IframeFactory, DashboardFactory, $scope, $rootScope, $sce, $state, $stateParams, ngDialog) {
    'ngInject';

    $scope.iframeActive = DashboardFactory.getCurrentStore().iframe_active;

    if(! $scope.iframeActive) {
      return
    }

    IframeFactory.getIframeSetting().success(function(res){
      $scope.formData = _parseSettingData(res.data.iframe_setting);

    }).error(function(res){
      $scope.firstSetup = true;
      $state.go('app.dashboard.settings.iframe.setting');
    });

    $scope.saveSetting = function(formData){
      if(formData.id) {
        IframeFactory.updateIframeSetting( formData.id, _parseformData(formData) ).success(function(res){
          $scope.formData = _parseSettingData(res.data.iframe_setting);
          $state.go('app.dashboard.settings.iframe.index');
        });
      } else {
        IframeFactory.createIframeSetting( _parseformData(formData) ).success(function(res){
          $scope.formData = _parseSettingData(res.data.iframe_setting);
          $state.go('app.dashboard.settings.iframe.index');
        });
      }
    };

    function _parseformData(formData) {
      if (formData.langs) {
        formData.multi_lang = _.keys(_.pick(formData.langs, function(lang, key){
          return lang;
        })).join(',');
        delete formData.langs;
      }
      return formData;
    }

    function _parseSettingData(settingData) {
      if (settingData.multi_lang && settingData.multi_lang !== '') {
        try {
          var langs = {
            zh_tw: settingData.multi_lang.indexOf('zh_tw') > -1,
            zh_cn: settingData.multi_lang.indexOf('zh_cn') > -1,
          };

          settingData.langs = langs;

          return settingData;

        } catch(e) {
          console.error('settingData is broken');
        }
      } else {
        // backup case for multi_lang equals null
        return settingData;
      }
    }
  }
}

export function colorpicker ($http){
  'ngInject';
  // Runs during compile
  return {
    restrict: 'A',
    scope: {
      color: '@'
    },
    link: function(scope, iElm, iAttrs, controller) {
      iElm.spectrum({
        showInput: true,
        preferredFormat: 'hex',
        cancelText: "Cancel",
        chooseText: "Save",
        color: scope.color,
        clickoutFiresChange: true

      });
    }
  };
}
