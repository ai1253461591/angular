var myModule = angular.module('myModule', ['ngRoute'])
	.config(function($routeProvider) {
		$routeProvider.caseInsensitiveMatch = true;

		$routeProvider
			.when("/home", {
				templateUrl: "Templates/21.1/home.html",
				controller: "homeController",
				controllerAs: "homeCtrl"
			})
			.when("/courses", {
				templateUrl: "Templates/21.1/courses.html",
				controller: "coursesController",
				controllerAs: "coursesCtrl",
				caseInsensitiveMatch: true
			})
			.when("/employees", {
				templateUrl: "Templates/21.1/employees.html",
				controller: "employeesController",
				controllerAs: "employeesCtrl"
			})
			.when("/employees/:id", {
				templateUrl: "Templates/21.1/employeedetail.html",
				controller: "employeeDetailController",
				controllerAs: "employeeDetailCtrl"
			})
			.otherwise({
				redirectTo: "/home"
			})
	})
	.controller('homeController', function() {
		this.message = "Home page";
	})
	.controller('coursesController', function() {
		this.courses = ["Android", "Ios", "Html5", "Java"];
	})
	.controller('employeesController', function($http, $route, $scope) {
		var vm = this;
		
		$scope.$on("$routeChangeStart", function(event, next, current) {
			if (!confirm("你确定想切换这个页面吗？目标路径："+next.$$route.originalPath)) {
				event.preventDefault();
			}
		});
		vm.reloadData = function() {
			$route.reload();
		}

		$http.get('http://localhost:8888/angular/employee.cfm').then(function(response) {
			// 注意在http里，我们能够使用this吗？这个this它将指向谁呢？
			// this.employees = response.data.rows;
			vm.employees = response.data.rows;
		})
	})
	.controller('employeeDetailController', function($http, $routeParams) {
		var vm = this;
		$http({
			url: "http://localhost:8888/angular/employeedetail.cfm",
			params: {
				id: $routeParams.id
			},
			method: "get"
		}).then(function(response) {
			vm.employee = response.data[0];
		})
	});