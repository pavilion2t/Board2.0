function enclose($rootScope, $stateParams) {
	'ngInject';
	return {
		restrict: 'EA',
		templateUrl: 'app/shared/directive/enclose.html',
		link: function (scope, element, attributes) {
			scope.src = attributes.src;

		}
	}
}

function iframeOnload($interval) {
	'ngInject';
	return {
		scope: {
			callBack: '&iframeOnload',
			updateTime: '&updateTime'
		},
		link: function (scope, element, attrs) {
			element.on('load', function () {
				return scope.callBack();
			});
			var stopTime = $interval(scope.updateTime, 500);
			element.on('$destroy', function () {
				$interval.cancel(stopTime);
			});
		}
	}
}
export class EncloseController {
	constructor($scope, $stateParams, $rootScope) {
		'ngInject';


		$rootScope.extendedView = true;
		$scope.refreshPage = function () {
			if ($scope.src) {
				$scope.iframesrc = '/v2/' + $stateParams.store_id + '/' + $scope.src;
			}
		};

		$scope.iframeLoadedCallBack = function () {

		};


		$scope.fixCss = function () {
			var content = $('iframe#encloseIframe').contents();
			if (content && content.find('#main-body').length > 0) {
				content.find('#menu').hide();
				content.find('#main-header').hide();
				content.find('#main').css('left', '0');
				content.find('#main-body').css('top', '0');
				content.find('.main-content-header.columns').css('left', '0px');
				if ($scope.src.startsWith('settings')) {
					content.find('.main-content .main-content-header.columns').css('bottom', '15px');
				}
				content.find('#main').css('padding', '0px 0px 50px 0px');
				content.find('.edit__body .panel').css('padding', '0px');
				$scope.cleanCss = true;
			}
		};

		$scope.cleanCss = false;
		$scope.updateTime = function () {

			$('iframe#encloseIframe').height($('.content__view').height());
			$scope.fixCss();

		};


		$scope.$watch('src', function () {
			$scope.refreshPage();
		});
	}

}

export default angular
.module('enclose_module', [])
.directive('enclose', enclose)
.directive('iframeOnload', iframeOnload)
.controller('EncloseController', EncloseController)

