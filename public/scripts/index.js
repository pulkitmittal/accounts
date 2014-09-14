angular
.module('index', ['ngRoute','ui.bootstrap','ngResource','ngSanitize','angular.filter'])
.value('messages', {
	notfound: {
		text: 'The location cannot be found. Please try again.',
		type: 'danger'
	}
})
.value('states', new Array("Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttaranchal", "Uttar Pradesh", "West Bengal"))
.factory('Utils', function($http) {
	var functions = {};
	
	functions.isEmpty = function(obj) {
		obj = obj || '';
		if(typeof obj === "string") {
			return obj === '' || obj.length === 0;
		}
		else if(typeof obj === "object") {
			if(obj.length) { // array
				return obj.length === 0;
			}
			else {
				return Object.keys(obj).length === 0;
			}
		}
	};
	
	functions.getLocation = function(val) {
		return $http.get('/getLocations', {
			params: {
				q: val
			}
		}).then(function(res){
			res = res ? JSON.parse(JSON.parse(res.data)) : { predictions : [] };
			var addresses = [];
			angular.forEach(res.predictions, function(item){
				addresses.push(item);
			});
			return addresses;
		});
	};
	
	functions.getDealer = function(id) {
		var promise = $http({ method: 'GET', url: '/dealer/'+id }).success(function(data, status, headers, config) {
			return data;
		});
		return promise;
	};
	
	functions.getDealers = function() {
		var promise = $http({ method: 'GET', url: '/dealers' }).success(function(data, status, headers, config) {
			return data;
		});
		return promise;
	};
	
	functions.getManufacturer = function(id) {
		var promise = $http({ method: 'GET', url: '/manufacturer/'+id }).success(function(data, status, headers, config) {
			return data;
		});
		return promise;
	};
	
	functions.getManufacturers = function() {
		var promise = $http({ method: 'GET', url: '/manufacturers' }).success(function(data, status, headers, config) {
			return data;
		});
		return promise;
	};
	
	functions.getTransporter = function(id) {
		var promise = $http({ method: 'GET', url: '/transporter/'+id }).success(function(data, status, headers, config) {
			return data;
		});
		return promise;
	};
	
	functions.getTransporters = function() {
		var promise = $http({ method: 'GET', url: '/transporters' }).success(function(data, status, headers, config) {
			return data;
		});
		return promise;
	};
	
	functions.getItemTypes = function() {
		var promise = $http({ method: 'GET', url: '/item_types' }).success(function(data, status, headers, config) {
			return data;
		});
		return promise;
	};
	return functions;
})
.run(['$rootScope', '$timeout', 'messages', function($root, $timeout, messages) {
	$root.$on('$routeChangeStart', function(e, curr, prev) {
		$root.message = '';
		try {
			if (curr.$$route && curr.$$route.resolve) {
				$root.loadingView = true;
			}
		} catch(err) {
			console.log(err);
			$root.message = messages.notfound;
		}
	});
	$root.$on('$routeChangeSuccess', function(e, curr, prev) {
		$root.loadingView = false;
		$timeout(function() {
			$root.heading = 'Sanjay Sales | '+ angular.element(document.getElementsByTagName('h1')).text();
		}, 100);
	});
	$root.$on('$routeChangeError', function(e, curr, prev) {
		$root.message = messages.notfound;
		$root.loadingView = false;
	});
	
	angular.element(document).on("keydown", function (e) {
		var tag = angular.element(e.target)[0].tagName.toLowerCase();
	    if (e.which === 8 && tag !== "input" && tag !== "textarea") {
	        e.preventDefault();
	    }
	});
}])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/home', {
		templateUrl: 'partials/home.html',
		controller: 'HomeCtrl'
	})
	.when('/dealer/add', {
		templateUrl: 'partials/add/dealer.html',
		controller: 'DealerCtrl',
		resolve: {
			dealer: function() {
				return {};
			}
		}
	})
	.when('/dealer/:id', {
		templateUrl: 'partials/add/dealer.html',
		controller: 'DealerCtrl',
		resolve: {
			dealer: function($route, Utils) {
				var id = $route.current.params.id;
				return Utils.getDealer(id);
			}
		}
	})
	.when('/dealers', {
		templateUrl: 'partials/view/dealers.html',
		controller: 'DealersViewCtrl',
		resolve: {
			dealers: function(Utils) {
				return Utils.getDealers();
			}
		}
	})
	.when('/manufacturer/add', {
		templateUrl: 'partials/add/manufacturer.html',
		controller: 'ManufacturerCtrl',
		resolve: {
			manufacturer: function() {
				return {};
			}
		}
	})
	.when('/manufacturer/:id', {
		templateUrl: 'partials/add/manufacturer.html',
		controller: 'ManufacturerCtrl',
		resolve: {
			manufacturer: function($route, Utils) {
				var id = $route.current.params.id;
				return Utils.getManufacturer(id);
			}
		}
	})
	.when('/manufacturers', {
		templateUrl: 'partials/view/manufacturers.html',
		controller: 'ManufacturersViewCtrl',
		resolve: {
			manufacturers: function(Utils) {
				return Utils.getManufacturers();
			}
		}
	})
	.when('/transporter/add', {
		templateUrl: 'partials/add/transporter.html',
		controller: 'TransporterCtrl',
		resolve: {
			transporter: function() {
				return {};
			}
		}
	})
	.when('/transporter/:id', {
		templateUrl: 'partials/add/transporter.html',
		controller: 'TransporterCtrl',
		resolve: {
			transporter: function($route, Utils) {
				var id = $route.current.params.id;
				return Utils.getTransporter(id);
			}
		}
	})
	.when('/transporters', {
		templateUrl: 'partials/view/transporters.html',
		controller: 'TransportersViewCtrl',
		resolve: {
			transporters: function(Utils) {
				return Utils.getTransporters();
			}
		}
	})
	.when('/sale/add', {
		templateUrl: 'partials/add/sale.html',
		controller: 'SaleCtrl',
		resolve: {
			sale: function() {
				return {};
			},
			dealers: function(Utils) {
				return Utils.getDealers();
			},
			item_types: function(Utils) {
				return Utils.getItemTypes();
			}
		}
	});
})
.controller('HomeCtrl', function($scope) {

});