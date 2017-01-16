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
					    controller: 'AppCtrl'
			  		}
		  	  }
		    })
	
})
.run(['$rootScope', '$state','PlatformService', function($rootScope, $state, PlatformService) {

	PlatformService.reset();
	
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
    	console.log('state change start', to);
    	PlatformService.sidebar.itens = [];
    	PlatformService.selectByState(to.name);
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params)
      }
    });
}])
.factory('PlatformService', function(){
	var platformService =  {
		modules: {app: []},
		sidebar: {
			visible: true,
			disabled: false,
			itens: [],
			toggle: function(){
				this.visible = !this.visible;
			}
		},
		
		navbar: {
			itens: []
		},
		
		reset: function(){
			this.sidebar.visible = true;
			this.sidebar.itens = [];
			this.navbar.itens = [];
			this.modules = {app: []}
		},
		
		registerModule: function(module, group){

			if(group){
				if(this.modules[group])
					this.modules[group].push(module);
				else {
					this.modules[group] = [];
					this.modules[group].push(module);
				}
			}
			else {
				this.modules['app'].push(module);
			} 
		},
		
		getModules: function(group){
			if(group)
				return this.modules[group];
			else
				return this.modules['app'];
		},
		
		selectByState: function(currentState){
			var appModules = this.modules['app'];
			angular.forEach(appModules, function(module){
	    		module.active = false;
	    		
	    		if(currentState && currentState.indexOf(module.state) == 0){
	    			module.active = true;
	    		}

	    	});
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
		
/*		configurarHome: function(){
				
				  $urlRouterProvider.otherwise("/home");

				  //Indica o estado inicial como home
				  this.configurarRota({
					  name: 'home',
					  url: '/home',
					  templateUrl: "app/home.html",
					  controller: 'AppCtrl'
				  });
		},*/
		
		configurarRota: function(config){			
			
			//Indica o estado inicial como home
			PlatformModule.$stateProvider
			.state(config.name, {
				url: config.url,
				views: {
					'main@' : {
						templateUrl: config.templateUrl,
						controller: config.controller + ''
					}
				}
			})
		}
	};
	
	return platformService;
});