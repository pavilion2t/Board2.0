export function inputImage() {
  return {
    restrict: 'E',
    scope: {
      title: '@title',
      limit: '@limit',
      onSelect: '=onSelect'
    },
    templateUrl: 'app/shared/directive/inputs/input-image.html',
    link: function(scope, elem, attrs) {
      scope.selectedImages = [];

      scope.removePhoto = function(file) {
        _.pull(scope.selectedImages, file);
      };

      scope.hideUpload = function() {
        return scope.limit ? (scope.selectedImages.length >= parseInt(scope.limit)) : false;
      };
    }
  };
}
// action when user has chosen file
export function inputImageRead() {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {

      elem.on('click', function () {
        this.value = null; // clear file last time selected
      });
      elem.on('change', function(event) {
        var file = event.target.files[0];
        console.log('43234', file);
        if(file) {
          scope.selectedImages.push(file);
        }
        console.log('scope.onSelect', scope.onSelect);
        if(scope.onSelect) {
          console.log('3213212312');
          scope.onSelect(file, scope.selectedImages);
        }
        scope.$digest();

      });
    }
  };
}

// preview selected file
export function imagePreview() {
  return {
    restrict: 'A',
    scope: {
      image: '=imagePreview'
    },
    link: function(scope, elem, attrs) {
      scope.$watch('image',function(file){
        try {
          var reader = new FileReader();
          reader.onloadend = function() {
            elem.attr('src', reader.result);
          };
          reader.readAsDataURL(file);

        } catch(e) {
          console.error("Can't preview image", e);
        }
      });
    }
  };
}
