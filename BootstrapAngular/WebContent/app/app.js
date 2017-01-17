Application = angular.module('FormDemo', ['components', 'modulo1'/*, 'modulo2'*/])

.controller('AppCtrl',function(PlatformService){
	
	var ctrl = this;
	PlatformService.sidebar.itens = [];
	PlatformService.selectModule();

});