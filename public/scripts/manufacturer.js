angular
.module('index')
.controller('ManufacturerCtrl', function($scope, $http, $rootScope, $route, $window, manufacturer, states, Utils) {
	
	$scope.isEmpty = Utils.isEmpty;
	$scope.getLocation = Utils.getLocation;
	$scope.states = states;
	$scope.manufacturer = manufacturer && manufacturer.status === 200 && manufacturer.data.done === true ? manufacturer.data.response : {};

	$scope.setLocation = function($item) {
		if(!$item || $item.terms.length < 3)
			return;
		var state = $item.terms[$item.terms.length - 2].value; // second last element is the state
		$scope.manufacturer.state = state;
		var city = $item.terms[$item.terms.length - 3].value; // third last element is the state
		$scope.manufacturer.city = city;
	};

	$scope.submit = function() {
		$scope.submitting = true;
		delete $scope.errors;
		$http.post('/manufacturer/add', {manufacturer: $scope.manufacturer})
		.success(function (data, status, headers, config) {
			$scope.submitting = false;
			if(data.done) {
				if($scope.manufacturer.id) {
					$rootScope.message = {
						text: 'Manufacturer successfully updated.',
						type: 'success'
					};
				} else {
					$rootScope.message = {
						text: 'Manufacturer successfully added.',
						type: 'success'
					};
					$scope.manufacturer = {};
				}
			} else {
				$rootScope.message = {
					text: data.error,
					type: 'danger'
				};
				$scope.errors = data.errors;
			}
		})
		.error(function (data, status, headers, config) {
			$rootScope.message = {
				text: status + ': ' + data.error.message,
				type: 'danger'
			};
			$scope.submitting = false;
		});
	};
	
	$scope.reset = function() {
		$route.reload();
	};
	
	$scope.deleteManufacturer = function(manufacturer, $index) {
		var id = manufacturer.ID;
		var deleteConfirm = $window.confirm('Are you sure you want to delete '+manufacturer.NAME+'?');

		if (deleteConfirm) {
			$scope.deletingRow = $index;
			$http.post('/manufacturer/delete/'+id)
			.success(function (data, status, headers, config) {
				$scope.deletingRow = -1;
				if(data.done) {
					$rootScope.message = {
						text: 'Manufacturer successfully deleted.',
						type: 'success'
					};
					$scope.manufacturers.splice($index, 1);
				} else {
					$rootScope.message = {
						text: data.error,
						type: 'danger'
					};
					$scope.errors = data.errors;
				}
			})
			.error(function (data, status, headers, config) {
				$rootScope.message = {
					text: status + ': ' + data.error.message,
					type: 'danger'
				};
				$scope.deletingRow = -1;
			});
		}
	};
})
.controller('ManufacturersViewCtrl', function($scope, $http, manufacturers) {
	$scope.manufacturers = manufacturers && manufacturers.status === 200 && manufacturers.data.done === true ? manufacturers.data.response : [];
});