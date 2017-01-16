angular.module('modulo2', [
        'ui.router',
        'platform',
        'components'
])
.run(['PlatformService', function(PlatformService) {
	console.log('registrou o modulo 2');
	PlatformService.registerModule({name: 'Modulo 2', state: 'modulo2'});
	
}])

.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    .state('modulo2', {
      url: "/modulo2",
      templateUrl: "app/modulo2/modulo2.html",
      controller: 'module2.Module2Ctrl'
    })
    .state('modulo2/menu1', {
    	url: "/modulo2/menu1",
    	templateUrl: "app/modulo2/menu1.html",
    	controller: 'module2.Menu1Ctrl'
    })
    .state('modulo2/menu2', {
    	url: "/modulo2/menu2",
    	templateUrl: "app/modulo2/menu2.html",
    	controller: 'module2.Menu2Ctrl'
    })
    
})

.controller('module2.Module2Ctrl', function($scope, $state, PlatformService) {
	console.log('entrou no modulo 2');
	PlatformService.sidebar.itens.push({name: 'Menu 2.1', state:'modulo2/menu1'});
	PlatformService.sidebar.itens.push({name: 'Menu 2.2', state:'modulo2/menu2'});
})
.controller('module2.Menu1Ctrl', function($scope, $state) {
	console.log('entrou no menu 1');
})
.controller('module2.Menu2Ctrl', function($scope, $state) {
	console.log('entrou no menu 2');
})
