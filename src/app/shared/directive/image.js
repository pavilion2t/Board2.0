function placeholderSrc() {
  var placeholderDefault = {
    store:     'assets/images/store_placeholder.png',
    customer:  'assets/images/customer_placeholder.png',
    inventory: 'assets/images/inventory_placeholder.png',
    user:      'assets/images/user_placeholder.png',
  }

  return {
    restrict: 'A',
    link: function(scope, elem, attrs){
      attrs.placeholderSrc = placeholderDefault[attrs.placeholderSrc] || attrs.placeholderSrc

      if(!elem.attr('src')) {
        elem.attr('src', attrs.placeholderSrc);
      }
      elem.one('error', function() {
        elem.attr('src', attrs.placeholderSrc);
      });
    }
  };
}


export default angular
  .module('image_module', [])
  .directive('placeholderSrc', placeholderSrc)

