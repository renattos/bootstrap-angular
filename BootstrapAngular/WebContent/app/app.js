Application = angular.module('FormDemo', ['components', 'modulo1'])

.controller('AppCtrl',function(PlatformService){
	
	var ctrl = this;
	PlatformService.sidebar.itens = [];
	PlatformService.selectModule();

});