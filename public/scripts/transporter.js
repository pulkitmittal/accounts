angular
.module('index')
.controller('TransporterCtrl', function($scope, $http, $rootScope, $route, $window, states, Utils) {
	
	$scope.isEmpty = Utils.isEmpty;
	$scope.getLocation = Utils.getLocation;
	$scope.states = states;

	$scope.setLocation = function($item) {
		if(!$item || $item.terms.length < 3)
			return;
		var state = $item.terms[$item.terms.length - 2].value; // second last element is the state
		$scope.transporter.state = state;
		var city = $item.terms[$item.terms.length - 3].value; // third last element is the state
		$scope.transporter.city = city;
	};

	$scope.submit = function() {
		$scope.submitting = true;
		delete $scope.errors;
		$http.post('/transporter/add', {transporter: $scope.transporter})
		.success(function (data, status, headers, config) {
			$scope.submitting = false;
			if(data.done) {
				if($scope.transporter.id) {
					$rootScope.message = {
						text: 'Transporter successfully updated.',
						type: 'success'
					};
				} else {
					$rootScope.message = {
						text: 'Transporter successfully added.',
						type: 'success'
					};
					$scope.transporter = {};
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
				text: 'Error: ' + status,
				type: 'danger'
			};
			$scope.submitting = false;
		});
	};
	
	$scope.reset = function() {
		$route.reload();
	};
	
	$scope.deleteTransporter = function(transporter, $index) {
		var id = transporter.ID;
		var deleteConfirm = $window.confirm('Are you sure you want to delete '+transporter.NAME+'?');

		if (deleteConfirm) {
			$scope.deletingRow = $index;
			$http.post('/transporter/delete/'+id)
			.success(function (data, status, headers, config) {
				$scope.deletingRow = -1;
				if(data.done) {
					$rootScope.message = {
						text: 'Transporter successfully deleted.',
						type: 'success'
					};
					$scope.transporters.splice($index, 1);
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
.controller('TransporterViewCtrl', function($scope, $http, transporter) {
	$scope.transporter = transporter && transporter.status === 200 && transporter.data.done === true ? transporter.data.response : {};
})
.controller('TransportersViewCtrl', function($scope, $http, transporters) {
	$scope.transporters = transporters && transporters.status === 200 && transporters.data.done === true ? transporters.data.response : [];
});