angular
.module('index')
.controller('SaleCtrl', function($scope, $http, $rootScope, $route, $window, dealers, item_types, sale, Utils) {
	
	$scope.isEmpty = Utils.isEmpty;
	$scope.sale = sale && sale.status === 200 && sale.data.done === true ? sale.data.response : {};
	$scope.dealers = dealers && dealers.status === 200 && dealers.data.done === true ? dealers.data.response : [];
	$scope.item_types = item_types && item_types.status === 200 && item_types.data.done === true ? item_types.data.response : [];
	
	// fix some sale attributes
	if($scope.sale && $scope.sale.dealer) {
		var dealerId = $scope.sale.dealer;
		$scope.sale.dealer = $scope.dealers.filter(function(f) {
			return f.ID === dealerId;
		})[0];
	}
	if($scope.sale && $scope.sale.item_type) {
		var itemTypeId = $scope.sale.item_type;
		$scope.sale.item_type = $scope.item_types.filter(function(f) {
			return f.ID === itemTypeId;
		})[0];
	}
	
	$scope.filterDealer = function(elm) {
		if($scope.sale.type === 'Tax Invoice') {
			return !elm.TIN;
		} else if($scope.sale.type === 'Sales Invoice') {
			return !!elm.TIN;
		} else {
			return false;
		}
	};
	
	$scope.isNaN = function(val) {
		return val ? isNaN(val) : false;
	};
	
	$scope.update = function() {
		var sale = $scope.sale;
		var item_type = sale.item_type;
		if(!item_type)
			return;
		sale.vat_rate = item_type.VAT_TAX.toFixed(2);
		sale.add_rate = item_type.ADD_TAX.toFixed(2);
		if(sale.item_quantity && sale.item_rate) {
			sale.vat_tax = sale.item_quantity * sale.item_rate * sale.vat_rate / 100;
			sale.add_tax = sale.item_quantity * sale.item_rate * sale.add_rate / 100;
			sale.invoice_amount = sale.item_quantity * sale.item_rate + sale.vat_tax + sale.add_tax;
		}
	};
	
	$scope.set = function(attr, value) {
		$scope[attr] = value;
	};
	
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};

	$scope.submit = function() {
		$scope.submitting = true;
		delete $scope.errors;
		$http.post('/sale/add', {sale: $scope.sale})
		.success(function (data, status, headers, config) {
			$scope.submitting = false;
			if(data.done) {
				if($scope.sale.id) {
					$rootScope.message = {
						text: 'Sale successfully updated.',
						type: 'success'
					};
				} else {
					$rootScope.message = {
						text: 'Sale successfully added.',
						type: 'success'
					};
					$scope.sale = {};
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
	
})
.controller('SalesViewCtrl', function($scope, $http, $window, sales) {
	$scope.sales = sales && sales.status === 200 && sales.data.done === true ? sales.data.response : [];
	
	$scope.deleteSale = function(sale, $index) {
		var id = sale.ID;
		var deleteConfirm = $window.confirm('Are you sure you want to delete '+sale.NAME+'?');

		if (deleteConfirm) {
			$scope.deletingRow = $index;
			$http.post('/sale/delete/'+id)
			.success(function (data, status, headers, config) {
				$scope.deletingRow = -1;
				if(data.done) {
					$rootScope.message = {
						text: 'Sale successfully deleted.',
						type: 'success'
					};
					$scope.sales.splice($index, 1);
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
});