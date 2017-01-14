Application = angular.module('FormDemo', ['components'])

.controller('AppCtrl',function(PlatformService){
	
	/*var modules = [
			{name:'Financeiro'},
			{name:'Agenda'},
			{name:'Fitness'}
	    ]*/
	
	var ctrl = this;
	
	ctrl.$onInit = function () {
		/*for(var i = 0; i < modules.length; i++){
			PlatformService.registerModule(modules[i]);
		}*/
		
//		PlatformService.selectModule(modules[1]);
	}

});