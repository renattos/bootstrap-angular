angular.module('modulo1', [
        'ui.router',
        'platform',
        'components'
])
.run(['PlatformService', function(PlatformService) {

	PlatformService.registerModule({name: 'Modulo 1', state: 'modulo1'});
	
}])
.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    .state('modulo1', {
      url: "/modulo1",
      templateUrl: "app/modulo1/modulo1.html",
      controller: 'modulo1.Module1Ctrl'
    })
    .state('modulo1/menu1', {
    	url: "/modulo1/menu1",
    	templateUrl: "app/modulo1/menu1.html",
    	controller: 'modulo1.Menu1Ctrl'
    })
    .state('modulo1/menu2', {
    	url: "/modulo1/menu2",
    	templateUrl: "app/modulo1/menu2.html",
    	controller: 'modulo1.Menu2Ctrl'
    })
    
})
.controller('modulo1.Module1Ctrl', function($scope, $state, PlatformService) {
	console.log('entrou no modulo 1');
	PlatformService.sidebar.itens.push({name: 'Menu 1.1', state:'modulo1/menu1'});
	PlatformService.sidebar.itens.push({name: 'Menu 1.2', state:'modulo1/menu2'});
})
.controller('modulo1.Menu1Ctrl', function($scope, $state) {
	console.log('entrou no menu 1');
})
.controller('modulo1.Menu2Ctrl', function($scope, $state) {
	console.log('entrou no menu 2');
})