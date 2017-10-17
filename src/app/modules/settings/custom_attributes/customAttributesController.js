export class CustomAttributesController {
  constructor($scope, $state, $stateParams,CustomAttributesFactory, DashboardFactory, $rootScope, gettextCatalog ) {
    'ngInject';

    $scope.title = 'Custom Attributes';
    $scope.section = 'inventory';
    $scope.attributes = [];
    var factory = CustomAttributesFactory;
    factory.getAttributes().success(function(data){
      $scope.attributes = data.custom_fields;
      _.each($scope.attributes, function(attribute){
        attribute._possible_values = _.map(attribute.possible_values, function(value){
          return {value:value};
        });
      });
    }).error(function(){
      alert('Error getting data');
    });

    var Attribute = function(){
      var fields = {};
      fields.name = '';
      fields.field_format = '';
      fields.possible_values = [];
      fields._possible_values = [];
      fields.applicable_type = 'Product';
      fields._show = true;
      fields._new = true;
      fields._forced = false;
      return fields;
    };

    $scope.fieldFormats = [];
    $scope.fieldFormats.push({label:"String",value:"string"});
    $scope.fieldFormats.push({label:"List",value:"list"});

    $scope.add = function(){
      $scope.attributes.push(new Attribute());
      $scope.adding = true;
    };

    $scope.addPossibleValue = function(attribute){
      attribute._possible_values.push({value:''});
    };
    $scope.adding = false;

    $scope.removePossibleValue = function(attribute, index){
      attribute._possible_values.splice(index,1);
    };

    $scope.save = function(attribute){

      if ( attribute.name && attribute.name.length >= 1 && attribute.field_format && attribute.field_format !== '' ) {
        if (attribute.field_format === 'list' && attribute._possible_values.length >= 1) {
          attribute.possible_values = [];
          _.each(attribute._possible_values, function (value) {
            attribute.possible_values.push(value.value);
          });
        }
        else {
          attribute.possible_values = null;
        }
        delete attribute._possible_values;
        delete attribute._show;


        if (attribute._new) {

          delete attribute._new;
          delete attribute._forced;
          factory.createAttribute(attribute).success(function () {
            $state.go($state.current.name, {}, {reload: true});
          }).error(function () {
            alert('Error when saving new attribute');
            $state.go($state.current.name, {}, {reload: true});
          });

        }
        else {
          delete attribute._new;
          delete attribute._forced;
          factory.updateAttribute(attribute.id, attribute).success(function () {
            $state.go($state.current.name, {}, {reload: true});
          }).error(function () {

            alert('Error when saving attribute');
            $state.go($state.current.name, {}, {reload: true});
          });
        }
      }
      else {
        alert('Required Field not entered');
      }
    };
    $scope.cancel = function(index){
      $scope.attributes.splice(index);
      $scope.adding = false;
    };


    $scope.delete = function(attribute, forced){
      var r = confirm('Do you want to delete this item?');
      if (r) {
        factory.deleteAttribute(attribute.id, null, forced).success(function () {
          $state.go($state.current.name, {}, {reload: true});
        }).error(function (a, b, c, d) {
          if (b === 400) {
            attribute._forced = true;
          }
          else {
            alert('Error when deleting attribute');
            $state.go($state.current.name, {}, {reload: true});
          }
        });
      }
    };
  }
}
