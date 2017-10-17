export class LanguagesController {
	constructor(LanguagesFactory, $scope, $state) {
		'ngInject';

		$scope.store = {};
		$scope.original_store = {};

		$scope.languageMap = LanguagesFactory.languages_by_locale;
		$scope.languageList = [];
		for (var key in $scope.languageMap) {
			$scope.languageList.push({ key: key, value: $scope.languageMap[key] });
		}


		LanguagesFactory.getLocales().success(function (data) {

			$scope.languages = data.store_locales;
		}).error(function (err) {
			console.error(err);
			$scope.errorMessage = err.message;
		});

		$scope.addEnabled = false;
		$scope.add = function () {
			$scope.addEnabled = true;
		};

		$scope.delete = function (language) {
			if (confirm('Are you sure you want to delete this? All inventory name and description in this language will be discarded.')) {
				LanguagesFactory.deleteLocales(language.id).success(function (data) {
					$state.go($state.current.name, {}, { reload: true });
				}).error(function (err) {
					console.error(err);
					$scope.errorMessage = err.message;
				});
			}
		};

		$scope.cancel = function () {
			if (confirm('Discard all changes?')) {
				$scope.store = angular.copy($scope.original_store);
			}
		};

		$scope.newLanguage = null;

		$scope.changeLanguage = function () {
			$scope.newLanguage = $('#lang_drop_down').val();
		};
		$scope.save = function () {

			if ($scope.newLanguage) {
				LanguagesFactory.createLocales($scope.newLanguage).success(function (data) {
					$state.go($state.current.name, {}, { reload: true });
				}).error(function (err) {
					console.error(err);
					$scope.errorMessage = err.message;
				});
			}

		};


	}
}
