angular.module('modulo1', [
        'platform',
        'components'
])
.run(['PlatformService', function(PlatformService) {
	
	PlatformService.registerModule({
		label: 'Modulo 1', 
		state: 'modulo1',
		url: '/modulo1',
		templateUrl: "app/modulo1/modulo1.html",
		controller: 'modulo1.Module1Ctrl',
		sidebarConfig: {
			  type: 'custom',
			  itens: [
			          {name: 'Menu 1.2', state:'modulo1.menu2'},
			          {name: 'Menu 1.1', state:'modulo1.menu1'},
			          {name: 'Menu 1.3', state:'modulo1.menu3', children: [
								{name: 'Menu 1.3.1', state:'modulo1.menu2'},
								{name: 'Menu 1.3.2', state:'modulo1.menu1'}           
			                     ]
			          }
			  ]
		  }
	});

	PlatformService.registerModule({
		parentState: 'modulo1',
		label: 'Menu 1.1 (Modulo 1)', 
		state: 'modulo1.menu1',
		url: '/menu1',
		templateUrl: "app/modulo1/menu1.html",
		controller: 'modulo1.Menu1Ctrl',
		sidebarConfig: {
			  type: 'parent'
		  }
	});
	
	PlatformService.registerModule({
		parentState: 'modulo1',
		label: 'Menu 1.2 (Modulo 1)', 
		state: 'modulo1.menu2',
		url: '/menu2',
		templateUrl: "app/modulo1/menu2.html",
		controller: 'modulo1.Menu2Ctrl',
		sidebarConfig: {
			  type: 'custom',
			  itens: [
			          {name: 'Menu 1.2.1', state:'.menu1'},
			          {name: 'Menu 1.2.2', state:'.menu2'}
			  ]
		  }
	});
	
	PlatformService.registerModule({
		parentState: 'modulo1',
		label: 'Menu 1.3 (Modulo 1)', 
		state: 'modulo1.menu3',
		url: '/menu3',
		templateUrl: "app/modulo1/menu3.html",
		controller: 'modulo1.Menu3Ctrl',
		
	});
	
}])
.controller('modulo1.Module1Ctrl', function() {
	console.log('entrou no modulo 1');
	var ctrl = this;
})
.controller('modulo1.Menu1Ctrl', function() {
	
	var ctrl = this;
	
	ctrl.usuarios = [
	                 {cpf:11111111111,nome:'Fulano', sobrenome:'de Tal'},
	                 {cpf:22222222222,nome:'Beutrano', sobrenome:'Moraes'},
	                 {cpf:33333333333,nome:'Ciclano', sobrenome: 'de Araújo'}
	           ]
	ctrl.gridusuario = {
			data: ctrl.usuarios,
			total: 100,
			offset: 10,
			page: 3
	}; 
	ctrl.usuario = {}
	
	ctrl.create = function(usu){
		ctrl.usuarios.push(usu);
		ctrl.usuario = {}
	}
	
	ctrl.load = function(model){
		console.log('CARREGAR GRID',model);
	}
	
	ctrl.cursos = [
	      {codigo:1,descricao:'Arquitetura'},
	      {codigo:2,descricao:'Ciência da Computação'},
	      {codigo:3,descricao:'Engenharia Civil'}
	   ]
	
	ctrl.localidades = [
			{id:1, cidade:'Distrito Federal'},
			{id:2, cidade:'Rio de Janeiro'},
			{id:3, cidade:'São Paulo'}
	     ]
})
.controller('modulo1.Menu2Ctrl', function() {
	console.log('entrou no menu 2');
	var ctrl = this;
})
.controller('modulo1.Menu3Ctrl', function() {
	console.log('entrou no menu 3');
	var ctrl = this;
	ctrl.nome = "teste do controller";
})
