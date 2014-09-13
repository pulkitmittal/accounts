angular
.module('index')
.controller('DealerCtrl', function($scope, $http, $rootScope, $route, $window, states, Utils) {
	
	$scope.isEmpty = Utils.isEmpty;
	$scope.getLocation = Utils.getLocation;
	$scope.states = states;

	$scope.setLocation = function($item) {
		if(!$item || $item.terms.length < 3)
			return;
		var state = $item.terms[$item.terms.length - 2].value; // second last element is the state
		$scope.dealer.state = state;
		var city = $item.terms[$item.terms.length - 3].value; // third last element is the state
		$scope.dealer.city = city;
	};

	$scope.submit = function() {
		$scope.submitting = true;
		delete $scope.errors;
		$http.post('/dealer/add', {dealer: $scope.dealer})
		.success(function (data, status, headers, config) {
			$scope.submitting = false;
			if(data.done) {
				if($scope.dealer.id) {
					$rootScope.message = {
						text: 'Dealer successfully updated.',
						type: 'success'
					};
				} else {
					$rootScope.message = {
						text: 'Dealer successfully added.',
						type: 'success'
					};
					$scope.dealer = {};
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
	
	$scope.deleteDealer = function(dealer, $index) {
		var id = dealer.ID;
		var deleteConfirm = $window.confirm('Are you sure you want to delete '+dealer.NAME+'?');

		if (deleteConfirm) {
			$scope.deletingRow = $index;
			$http.post('/dealer/delete/'+id)
			.success(function (data, status, headers, config) {
				$scope.deletingRow = -1;
				if(data.done) {
					$rootScope.message = {
						text: 'Dealer successfully deleted.',
						type: 'success'
					};
					$scope.dealers.splice($index, 1);
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
.controller('DealerViewCtrl', function($scope, $http, dealer) {
	$scope.dealer = dealer && dealer.status === 200 && dealer.data.done === true ? dealer.data.response : {};
})
.controller('DealersViewCtrl', function($scope, $http, dealers) {
	$scope.dealers = dealers && dealers.status === 200 && dealers.data.done === true ? dealers.data.response : [];
});