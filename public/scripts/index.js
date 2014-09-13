angular
.module('index', ['ngRoute','ui.bootstrap','ngResource','ngSanitize'])
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
	return functions;
})
.run(['$rootScope', 'messages', function($root, messages) {
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
	});
	$root.$on('$routeChangeError', function(e, curr, prev) {
		$root.message = messages.notfound;
		$root.loadingView = false;
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
		controller: 'DealerCtrl'
	})
	.when('/dealer/:id', {
		templateUrl: 'partials/add/dealer.html',
		controller: 'DealerViewCtrl',
		resolve: {
			dealer: function($q, $http, $route) {
				var id = $route.current.params.id;
				var promise = $http({ method: 'GET', url: '/dealer/'+id }).success(function(data, status, headers, config) {
					return data;
				});
				return promise;
			}
		}
	})
	.when('/dealers', {
		templateUrl: 'partials/view/dealers.html',
		controller: 'DealersViewCtrl',
		resolve: {
			dealers: function($http) {
				var promise = $http({ method: 'GET', url: '/dealers' }).success(function(data, status, headers, config) {
					return data;
				});
				return promise;
			}
		}
	})
	.when('/manufacturer/add', {
		templateUrl: 'partials/add/manufacturer.html',
		controller: 'ManufacturerCtrl'
	})
	.when('/manufacturer/:id', {
		templateUrl: 'partials/add/manufacturer.html',
		controller: 'ManufacturerViewCtrl',
		resolve: {
			manufacturer: function($q, $http, $route) {
				var id = $route.current.params.id;
				var promise = $http({ method: 'GET', url: '/manufacturer/'+id }).success(function(data, status, headers, config) {
					return data;
				});
				return promise;
			}
		}
	})
	.when('/manufacturers', {
		templateUrl: 'partials/view/manufacturers.html',
		controller: 'ManufacturersViewCtrl',
		resolve: {
			manufacturers: function($http) {
				var promise = $http({ method: 'GET', url: '/manufacturers' }).success(function(data, status, headers, config) {
					return data;
				});
				return promise;
			}
		}
	})
	.when('/transporter/add', {
		templateUrl: 'partials/add/transporter.html',
		controller: 'TransporterCtrl'
	})
	.when('/transporter/:id', {
		templateUrl: 'partials/add/transporter.html',
		controller: 'TransporterViewCtrl',
		resolve: {
			transporter: function($q, $http, $route) {
				var id = $route.current.params.id;
				var promise = $http({ method: 'GET', url: '/transporter/'+id }).success(function(data, status, headers, config) {
					return data;
				});
				return promise;
			}
		}
	})
	.when('/transporters', {
		templateUrl: 'partials/view/transporters.html',
		controller: 'TransportersViewCtrl',
		resolve: {
			transporters: function($http) {
				var promise = $http({ method: 'GET', url: '/transporters' }).success(function(data, status, headers, config) {
					return data;
				});
				return promise;
			}
		}
	});
})
.controller('HomeCtrl', function($scope) {

});