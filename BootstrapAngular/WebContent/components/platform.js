angular.module('platform', [])

/****************************************************************************************************************************************************/  
/*
 * DIRETIVA PARA CONFIGURACAO DOS ITENS DE LAYOUT
 * */
.factory('PlatformService', function(){
	return {
		modules: {app: []},
		sidebar: {
			visible: false,
			disabled: false,
			itens: []
		},
		
		navbar: {
			itens: []
		},
		
		reset: function(){
			this.sidebar.visible = false;
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
		
		selectModule: function(m){
			var appModules = this.modules['app'];
			for(var i = 0; i < appModules.length; i++){
				appModules[i].active = false;
			}
			m.active = true;
		}
	};
});