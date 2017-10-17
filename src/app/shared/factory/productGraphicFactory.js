export function productGraphicFactory($rootScope) {
	// types: thumb, big_thumb, small, medium, big, original
  'ngInject';
  var get = function(product_id, type) {
  	return $rootScope.s3 + '/product_graphics/' + product_id + '/' + type + '/product_graphic.jpg';
  };

  return {
    get: get,
  };

}

