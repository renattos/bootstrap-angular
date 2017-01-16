angular.module('platform', [])

/****************************************************************************************************************************************************/  
/*
 * DIRETIVA PARA CONFIGURACAO DOS ITENS DE LAYOUT
 * */
.factory('PlatformService', function(){
	return {
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
		}
	};
});