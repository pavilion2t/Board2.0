function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function pretty(str) {
  return str.split('_').map(capitalize).join(' ')
}

export class EmailTemplateIndexController {
  constructor($scope, $state, $stateParams,EmailTemplateFactory, DashboardFactory, $rootScope, gettextCatalog ) {
    'ngInject';

    $scope.title = 'Email Template';

    var storeId = DashboardFactory.getStoreId();
    $scope.route = $rootScope.gateway + '/v2/stores/' + storeId + '/email_templates';

    $scope.columns = [
      {field: 'id', name: gettextCatalog.getString("ID"), ratio: '10%'},
      {field: 'from', name: gettextCatalog.getString("From"), ratio: '35%'},
      {field: 'subject', name: gettextCatalog.getString("Subject"), ratio: '25%'},
      {
        field: 'template_type',
        name: gettextCatalog.getString("Template Type"),
        ratio: '20%',
        formatter: (row, cell, value)=>pretty(value),
      },
      {
        field: 'default',
        name: gettextCatalog.getString("Default"),
        ratio: '10%',
        formatter: (row, cell, value)=>value?'<i class="fa fa-check"></i>':null,
      },
    ];


    $scope.actions = [
      ['View', function(item) {
        $state.go('app.dashboard.settings.email-template.view', { store_id: storeId, listing_id: item.id });
      }],
      ['Make Primary', function(item) {
        $scope.loadingGrid = true
        EmailTemplateFactory.makePrimary(item, item.id, )
          .success(function(data){
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function(err) {
            console.error(err);
            $scope.loadingGrid = false
            $scope.errorMessage = err.message
          })
      }],
      ['Delete', function(item) {
        if(!confirm('Do you really want to delete this item?')) return false;
        $scope.loadingGrid = true;
        EmailTemplateFactory.deleteTemplate(item.id)
          .success(function(data) {
            console.log(data);
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function(err) {
            console.error(err);
            $scope.loadingGrid = false;
            $scope.errorMessage = err.message;
          });
      }],
    ];


    $scope.createNewItem = function(){
      $state.go('app.dashboard.settings.email-template.new');
    };
  }
}

export class EmailTemplateController {
  constructor($scope, $state, $stateParams,EmailTemplateFactory, $rootScope,$templateCache ) {
    'ngInject';

    if ( CKEDITOR.instances['mytextarea'] ) {
      CKEDITOR.instances['mytextarea'].destroy();
    }
    $scope.newdata = true;

    $scope.template = { template_type: "invoice" };

    // Existing Template
    if ( $stateParams.listing_id ){
      EmailTemplateFactory.getTemplate($stateParams.listing_id).then(function(data){
        console.log(data);
        $scope.template = data.data;
        $('#mytextarea').val(data.data.content);
        $scope.newdata = false;
        initializeArea();
      });
    }
    // New Template
    else {
      $scope.template.template_type = 'invoice';
      loadTemplate($scope.template.template_type);
      initializeArea();
    }

    function loadTemplate(templateType){
      $.get( '/modules/settings/email_template/templates/'+templateType+'.html', function( data ) {
        data = data.replace('||| store.logo |||','<img src="'+store.logo_url+'">');
        $scope.template.content = data;
        $('#mytextarea').val(data);

      });
    }

    $scope.loadDefault = function(){
      loadTemplate($scope.template.template_type);
      initializeArea();
    };

    var store = $rootScope.currentStores[0];

    CKEDITOR.config.extraPlugins += (CKEDITOR.config.extraPlugins.length === 0 ? '' : ',') + 'liquidBlock,storeLogo';
    CKEDITOR.config.entities = false;

    CKEDITOR.config.height = '500px';
    CKEDITOR.config.width  = '100%';


    $scope.addTemplate = function(){
      $scope.template.content = CKEDITOR.instances['mytextarea'].getData();

      if ( $scope.newdata ) {
        EmailTemplateFactory.createTemplate($scope.template).then(function(){
          $state.go('app.dashboard.settings.email-template.index');
        });
      }
      else {
        EmailTemplateFactory.updateTemplate($scope.template, $stateParams.listing_id).then(function(){
          $state.go('app.dashboard.settings.email-template.index');
        });
      }
    };

    function initializeArea(){
      if ( CKEDITOR.instances['mytextarea'] ) {
        CKEDITOR.instances['mytextarea'].destroy();
      }
      setTimeout(function(){CKEDITOR.replace( 'mytextarea' );},1);
    }

    CKEDITOR.config.liquidBlock = {};
    CKEDITOR.config.liquidBlock.tabs = {};

    function addTabs(field,name){
      CKEDITOR.config.liquidBlock.tabs[field] = {};
      CKEDITOR.config.liquidBlock.tabs[field].name = name;
      CKEDITOR.config.liquidBlock.tabs[field].children = [];
    }
    function addVars(field,name,value){
      CKEDITOR.config.liquidBlock.tabs[field].children.push({name:name,value:value});
    }

    addTabs('liquid','Liquid Fields');
    addTabs('store','Store Variables');
    addTabs('invoice','Invoice Variables');
    addTabs('customer','Customer Variables');
    addTabs('user','User Fields');


    addVars('liquid','Start For Loop','{% for item in list %}');
    addVars('liquid','Start For Loop','{% for item in list %}');

    addVars('store','Store Name','{{ store.name }}');
    addVars('store','Store Phone','{{ store.phone }}');
    addVars('store','Store Address','{{ store.address }}');
    addVars('store','Store Policy','{{ store.policy }}');

    addVars('invoice','Invoice Number','{{ order.number }}');
    addVars('invoice','Invoice Date','{{ order.create_date }}');
    addVars('invoice','Invoice Type','{{ order.type }}');
    addVars('invoice','Invoice Number','{{ order.ref }}');
    addVars('invoice','Invoice Status','{{ order.status }}');
    addVars('invoice','Invoice Subtotal','{{ order.subtotal }}');
    addVars('invoice','Invoice Discount','{{ order.discount_amount }}');
    addVars('invoice','Invoice Tax','{{ order.tax_amount }}');
    addVars('invoice','Invoice Total','{{ order.total_amount }}');

    addVars('invoice','Line Items (Array)','{% for line_item in order.line_items %}{% endfor %}');
    addVars('invoice','Line Item Label','{{ line_item.label }}');
    addVars('invoice','Line Item Quantity','{{ line_item.quantity }}');
    addVars('invoice','Line Item Price','{{ line_item.price }}');
    addVars('invoice','Line Item Total','{{ line_item.total }}');

    addVars('invoice','Discount Items (Array)','{% for discount in line_item.discounts %}{% endfor %}');
    addVars('invoice','Discount Name','{{ discount.name }}');
    addVars('invoice','Discount Amount','{{ discount.amount }}');

    addVars('customer','Customer Name','{{ order.customer.name }}');
    addVars('customer','Customer Email','{{ order.customer.email }}');
    addVars('customer','Billing Address','{{ order.billing_address }}');
    addVars('customer','Delivery Address','{{ order.delivery_address }}');

    addVars('user','User Name','{{ user.full_name }}');
    addVars('user','User Confirmation URL','{{ user.confirmation_url }}');

    CKEDITOR.config.storeLogo = {url: store.logo_url};




  }
}
