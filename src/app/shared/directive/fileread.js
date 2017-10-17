function fileread($rootScope) {
  'ngInject';
    return {
        restrict: 'A',
        scope:{
            onSelected: "&"
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                     // console.log(changeEvent);
                    // $rootScope.fileread = changeEvent.target.files[0];
                    if(changeEvent.target.files.length === 0){
                        return ;
                    }
                    scope.onSelected({file:changeEvent.target.files[0]});
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}

function filereadModel($rootScope) {
  'ngInject';
    return {
        require: '?ngModel',
        link: function (scope, element, attributes,ngModel) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {

                    // name = changeEvent.target.files[0];
                    ngModel.$setViewValue(changeEvent.target.files[0]);
                    // scope.inventory.image = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}

function shouldDisable($rootScope) {
  'ngInject';
    return {

        link: function (scope, element, attributes) {
            var enable_list = $rootScope.enable_list || [];

            if(enable_list.indexOf( element.attr("name")) >=0){
                element.attr("disabled","disabled");
            }

        }
    }
}


function enterSubmit($rootScope) {
  'ngInject';
    return {

        link: function (scope, element, attributes) {
            var keycode;
            element.on('keypress',function(e){
                if (window.event) {
                    keycode = window.event.keyCode;
                }
                else if (e) {
                    keycode = e.which;
                }
                else {
                    return true;
                }

                if (keycode == 13) {
                   scope.$eval(attributes.formSubmit);
                   return false;
                } else {
                   return true;
                }
            });
        }
    }
}


export default angular
  .module('fileread_module', [])
  .directive('fileread', fileread)
  .directive('filereadModel', filereadModel)
  .directive('shouldDisable', shouldDisable)
  .directive('enterSubmit', enterSubmit)

