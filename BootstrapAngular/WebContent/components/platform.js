var PlatformModule = angular.module('platform', ['ui.router'])

/****************************************************************************************************************************************************/  
/*
 * DIRETIVA PARA CONFIGURACAO DOS ITENS DE LAYOUT
 * */
PlatformModule.config(function($stateProvider, $urlRouterProvider){
	
	PlatformModule.$stateProvider = $stateProvider;
	PlatformModule.$urlRouterProvider = $urlRouterProvider;
	
	$urlRouterProvider.otherwise("/home");

	  //Indica o estado inicial como home
	  $stateProvider
		    .state('home', {
		      url: "/home",
		      views: {
			  		'main@' : {
			  			templateUrl: "app/home.html",
			  			controllerAs: '$ctrl',
					    controller: 'AppCtrl'
			  		}
		  	  }
		    })
	
})
.run(['$rootScope', '$state','PlatformService', function($rootScope, $state, PlatformService) {

	PlatformService.reset();
	
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
    	
    	var selectedModule = PlatformService.selectByState(to.name);
    	console.log('selected module: ', selectedModule);
    	
    	
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params)
      }
    });
}])
.factory('PlatformService', function(){
	var platformService =  {
		modules: {app: []},
		currentModule: null,
		sidebar: {
			visible: true,
			disabled: false,
			itens: [],
			toggle: function(){
				this.visible = !this.visible;
			}
		},

		reset: function(){
			this.sidebar.visible = true;
			this.sidebar.itens = [];
			
			this.modules = {app: []}
		},
		
		registerModule: function(module, group){
			
			var groupId = ( module.parentState ? module.parentState : 'app');
//			var groupId = (group ? group : 'app');
			
			if( ! this.modules[groupId] ) {
				this.modules[groupId] = [];
			}
			this.configurarRota(module);
			this.modules[groupId].push(module);
			 
		},
		
		getModules: function(group){
			if(group)
				return this.modules[group];
			else
				return this.modules['app'];
		},
		
		selectByState: function(currentState){
			var appModules = this.modules['app'];
			var current = this.currentModule;

			//localiza o nav atual
			angular.forEach(appModules, function(module){
	    		module.active = false;
	    		if(currentState && currentState.indexOf(module.state) === 0){
	    			module.active = true;
	    			current = module;
	    		}

	    	});
			
			//localiza o sub-nav atual
			var submoduleAux = this.currentSubModule;
			if( current){
				var subModules = this.modules[current.state];
				angular.forEach(subModules, function(module){
					module.active = false;
					
					if(currentState && currentState == module.state ){
						module.active = true;
						submoduleAux = module;
					}
					
				});
			}
			
			var ctx = {currentModule:current, subModule: submoduleAux};
			this.configureSidebar(current, submoduleAux);
			
			return ctx;
		},
		
		configureSidebar: function(module, subModule){
			
			if(module && ( !subModule || ( subModule.sidebarConfig && subModule.sidebarConfig.type == 'parent') ) ){
				var sidebarConfig = module.sidebarConfig;
				if(sidebarConfig){
					if(sidebarConfig.type == 'custom'){
						this.sidebar.itens = sidebarConfig.itens;
						this.sidebar.visible = true;
					}
				} else {
					this.sidebar.itens = [];
					this.sidebar.visible = false;
				}
			}
			
			if(subModule){
				var sidebarConfig = subModule.sidebarConfig;
				if(sidebarConfig){
					if(sidebarConfig.type == 'custom'){
						this.sidebar.itens = sidebarConfig.itens;
						this.sidebar.visible = true;
					}
				} else {
					this.sidebar.itens = [];
					this.sidebar.visible = false;
				}
			}
		},
		
		selectModule: function(m){
			var appModules = this.modules['app'];
			for(var i = 0; i < appModules.length; i++){
				appModules[i].active = false;
			}
			
			if(m){
				m.active = true;
			}
			
			return true;
		},

		configurarRota: function(config){			
			
			//Indica o estado inicial como home
			PlatformModule.$stateProvider
			.state(config.state, {
				url: config.url,
				views: {
					'main@' : {
						  
							template: '<' + config.component + '/>'
					}
						/*{
						 * config.component
						templateUrl: config.templateUrl,
						controllerAs: '$ctrl',
						controller: config.controller
						
					}*/
				}
			})
			
		}
	};
	
	return platformService;
});