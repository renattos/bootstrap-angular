Application = angular.module('FormDemo', ['components'])

.controller('AppCtrl',function($scope, PlatformService){
	
	$scope.sidebar = PlatformService.sidebar;
	$scope.navbar = PlatformService.navbar;
	
	$scope.sidebar.itens = [
	       {name: 'Menu 1'},
	       {name: 'Menu 2', active: true},
	       {name: 'Menu da funcionalidade mais importante em qualquer ponto do sistema 3'},
	       {name: 'Menu 4'},
	       {name: 'Menu 5'},
	]
	
	$scope.navbar.itens = [
	       {name: 'Nav 1'},                
	       {name: 'Nav 2', active: true},                
	       {name: 'Nav 3'},                
	       {name: 'Nav 4'},                
	       {name: 'Nav 5'}                
	]
	
	$scope.teste2 = function(){
		PlatformService.setSidebarVisible(!$scope.sidebar.visible);
	}

});