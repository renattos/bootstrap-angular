angular.module('components', ['ngMessages','platform'])

/****************************************************************************************************************************************************/ 
/*
 * COMPONENTES DE LAYOUT
 * */
.component('navbar', {
	templateUrl: 'components/tpl/navbar/navbar.component.tpl.html',
	bindings: {
		itens: '=',
		brand: '@'
	},
	controller: function (PlatformService, $state) {
		var ctrl = this;
		
		ctrl.sidebar = PlatformService.sidebar;
		
		ctrl.select = function(item){
			if(PlatformService.selectModule(item)){
				$state.go(item.state);
			}
		}
		
		ctrl.toggleSidebar = function(){
			PlatformService.sidebar.toggle();
		}
		
	}
})
.component('sidebar', {
    templateUrl: 'components/tpl/sidebar/sidebar.component.tpl.html',
    bindings: {
        itens: '='
    },
    controller: function () {
        var ctrl = this;
    }
})
.component('tree', {
    templateUrl: 'components/tpl/sidebar/sidebar.component.tpl.html',
    bindings: {
        itens: '=',
        title: '@'
    },
    controller: function () {
        var ctrl = this;
    }
})
.component('node', {
    templateUrl: 'components/tpl/sidebar/sidemenuitem.component.tpl.html',
    bindings: {
        node: '='
    },
    controller: function (PlatformService) {
        var ctrl = this;
        ctrl.expanded = true;
        
        ctrl.select = function (n) {
        	var subModules = PlatformService.sidebar.itens;
        	
			angular.forEach(subModules, function(module){
				module.active = false;				
			});
			
			if(n){
				n.active = true;
			}
        	
        }
        
        ctrl.toggle = function(){
        	ctrl.expanded = !ctrl.expanded;
        }
    }
})

.component('application', {
    templateUrl: 'components/tpl/application.tpl.html',
    bindings: {
        brand: '@'
    },
    controller: function (PlatformService) {
        var ctrl = this;
        ctrl.appModules = PlatformService.getModules();
        ctrl.sidebar = PlatformService.sidebar;
        
        ctrl.toggleSidebar = function(){
        	ctrl.sidebar.visible = !ctrl.sidebar.visible; 
        }

    }
})

/****************************************************************************************************************************************************/ 
/*
 * DIRETIVAS UTILITARIAS
 * */
/* Directive: usada para inserir uma diretiva no DOM a partir do nome dela. Nao permite passar parametros para a diretiva */
.directive('directive', function($compile) {
    return {
      
      restrict: 'E',
      scope: { insert: '@', params: '<' },
      replace: true,
      link: function(scope, element, attrs, ctrl){
    	  
    	  var directiveName = scope.insert;

    	  var directiveParams = '';
          for (var i in scope.params) {
        		  directiveParams += i + "=\"params['" + i + "']\" ";
          }

          var template = angular.element('<' + directiveName + ' ' + directiveParams +'/>');
	      element.append(template);
	      $compile(template)(scope);
	  }
    };
  })
/****************************************************************************************************************************************************/  
/*
 * DIRETIVA PARA CONTROLE DE ABAS (TAB)
 * */
 
.directive('tabs', function($templateRequest, $compile) {
    return {
      
      restrict: 'E',
      scope: { },
      controller: function ($scope) {
    	  
    	  $scope.panes = [];
    	  
    	  $scope.selectPane = function(pane){
    		  
    		  angular.forEach($scope.panes, function(p){
    			  p.selected = false;
    		  });
    		  
    		  var idx = $scope.panes.indexOf(pane);
    		  if(idx >= 0){
    			  $scope.panes[idx].selected = true;
    		  }
    	  };
    	  
    	  this.addPane = function(pane){
    		  $scope.panes.push(pane);
    		  if($scope.panes.length > 0){
    			  $scope.panes[0].selected = true;
    		  }
    	  };
      },
      link: function(scope, element, attrs){
		  $templateRequest("components/tpl/tabs/tabs.html").then(function(html){
		      var template = angular.element(html);
		      element.append(template);
		      $compile(template)(scope);
		   });
	  }
    };
  })
.directive('tab', function() {
    return {
      
      restrict: 'E',
      scope: { title: '@', body: '@' },
      require: '^tabs',
      
      link: function(scope, element, attrs, ctrl){
		  ctrl.addPane({
			  title: scope.title,
			  body: scope.body,
			  selected: false
		  });
	  }
    };
  })
/****************************************************************************************************************************************************/
/*
 * Criacao de Janelas (PopUp) na aplicacao
 * */
.component('popupComponent', {
        bindings: {
            popup: '<'
        },
        controller: function ($scope, $compile, $element) {
            var ctrl = this;

            var directiveName = ctrl.popup.directive;

            var directiveParams = '';
            for (var i in ctrl.popup.params) {
                directiveParams += i + "=\"$ctrl.popup.params['" + i + "']\" ";
            }

            var strTemplate = '<' + directiveName + ' ' + directiveParams + "popup-config='$ctrl.popup.config'/>";

            var template = angular.element(strTemplate);

            $element.append(template);

            $compile(template)($scope);
        }
})

.service('PopupService', function () {
    var service = this;

    service.popups = [];

    service.adicionar = function (titulo, directive, params, botoes, showClose, modal) {
        var novoPopup = {};

        novoPopup.directive = directive;
        novoPopup.params = params;

        novoPopup.config = {
            titulo: titulo,
            botoes: botoes,
            showClose: showClose,
            modal: modal ? modal : true,
            close: function () {
                service.retirar(novoPopup.config);
            }
        };

        service.popups.push(novoPopup);
        return novoPopup.config;
    };

    service.alert = function (mensagem, configObj) {
        var popup;

        var titulo = "Mensagem";
        if (configObj) {
            titulo = configObj.titulo ? configObj.titulo : titulo;
        }

        popup = service.adicionar(titulo, 'alert', {msg: mensagem}, [{label: 'OK', onClick: close}]);

        function close() {
            service.retirar(popup);
        }
    };

    service.retirar = function (popupConfig) {
    	var janelas = service.popups;
    	for(var i=0 ; i<janelas.length; i++){
    	    if(janelas[i].config == popupConfig)
    	        janelas.splice(i);
    	}
    };
})

.component('popupContainer', {
    templateUrl: 'components/tpl/popup/popup-container.html',
    controller: function (PopupService) {
        var ctrl = this;

        ctrl.popups = PopupService.popups;
        ctrl.fechar = fechar;

        function fechar(popup) {
            PopupService.retirar(popup);
        }
    }
})

.component('alert', {
    template: "<p>{{$ctrl.msg}}</p>",
    bindings: {
        msg: '<'
    }
})

  
/****************************************************************************************************************************************************/
/*
 * DIRETIVA PARA GRIDS (tabela de dados)
 * */
 
.directive('grid', function($templateRequest, $compile) {
    return {
      
      restrict: 'E',
      scope: { 
    	  model:'=ngModel',
    	  selectable: '=',
    	  onPageChange: '='
      },
      controller: function ($scope) {
    	 
    	  $scope.columns = [];
    	  $scope.select = function(item){
    		  var itens = $scope.model.itens;
    		  if(!itens){
    			  itens = $scope.model.itens = [];
    		  }
    		  
    		  var index = itens.indexOf(item);
    		  
    		  if(index >=0){
    			  itens.splice(index, 1);
    			  $scope.model.all = false;
    		  } else {
    			  itens.push(item);
    			  
    			  if(itens.length == $scope.model.data.length){
    				  $scope.model.all = true;
    			  }
    			  
    		  }
    		  
    	  }
    	  
    	  $scope.selectAll = function(){
    		  if(! $scope.model.itens ){
    			  $scope.model.itens = [];
    		  } else {
    			  $scope.model.itens.splice(0, $scope.model.itens.length);  
    		  }
    		  
    		  angular.forEach($scope.model.data, function (d) {
    			  d._selected = $scope.model.all;
    			  
    			  if($scope.model.all){
        			  $scope.model.itens.push(d);
        		  }
    		  });
    		  
    	  }
    	  
    	  $scope.previousPage = function(){
    		  var page = Number($scope.model.page);
    		  
    		  if(page > 1 ){
    			  page -= 1;
    		  } else {
    			  page = 1;  
    		  }
    		  
    		  $scope.model.page = page;
    		  $scope.updateGrid($scope.model);
    	  }
    	  
    	  $scope.nextPage = function(){
    		  var page = Number($scope.model.page);
    		  var totalPages = $scope.model.total / $scope.model.offset;
    		  
    		  if(page < totalPages ){
    			  page += 1;
    		  } else {
    			  page = totalPages;  
    		  }
    		  
    		  $scope.model.page = page;
    		  $scope.updateGrid($scope.model);
    	  }
    	  
    	  $scope.updateGrid = function(model){
    		  model.page = Number(model.page);
    		  if($scope.onPageChange){
    			  $scope.onPageChange(model);  
    		  }
    		  
    	  }
    	  
    	  this.addColumn = function(col){
    		  $scope.columns.push(col);
    	  };
      },
      link: function(scope, element, attrs){
		  $templateRequest("components/tpl/grid/grid.html").then(function(html){
		      var template = angular.element(html);
		      element.append(template);
		      $compile(template)(scope);
		   });
	  }
    };
  })
.directive('column', function() {
    return {
      
      restrict: 'E',
      scope: { title: '@', field: '@', renderer:'@' },
      require: '^grid',
      link: {
    	  pre: function(scope, element, attrs, ctrl){
    		  ctrl.addColumn({
    			  title: scope.title,
    			  field: scope.field,
    			  renderer: scope.renderer ? scope.renderer : 'default-cell-renderer'
    		  });
    	  }
      }
    };
  })
  .component('defaultCellRenderer', {
        bindings: {
            model: '<',
            field: '<'
        },
        template: '<span>{{$ctrl.model[$ctrl.field]}}</span>',
        controller: function () {
            var ctrl = this;
        }
})
  
/***********************************************************************************************************/
  /*
   * Componentes de formulario
   * 
   */
.component('textfield',{
	bindings: {
		label: '@',
		name: '@',
		tooltip:'@',
		placeholder:'@',
		wPhone:'@',
		wTablet:'@',
		wDesktop:'@',
		minlength: '=ngMinlength',
		maxlength: '=ngMaxlength',
		model: '=ngModel',
		required: '=ngRequired',
		readonly: '=ngReadonly',
		disabled: '=ngDisabled',
		onchange: '=ngChange'
	},
	require: {
		viewForm: '^form'
	},
	templateUrl: 'components/tpl/form/textfield.tpl.html',
	controller: function($attrs){
		var ctrl = this;
		
		if(!ctrl.name){
			var strNgModel = $attrs.ngModel;
			ctrl.name = strNgModel;
		}
		
		ctrl.applyWidth = function(){
			var classes = '';
			
			if(!ctrl.wPhone){ ctrl.wPhone = 12;} 
			if(!ctrl.wTablet){ ctrl.wTablet = 8;} 
			if(!ctrl.wDesktop){ ctrl.wDesktop = 6;}
			
			classes += ' col-xs-' + ctrl.wPhone;
			classes += ' col-sm-' + ctrl.wTablet;
			classes += ' col-md-' + ctrl.wDesktop;
			
			return classes;
		}
	}
})
.component('telefone',{
	bindings: {
		label: '@',
		name: '@',
		tooltip:'@',
		placeholder:'@',
		model: '=ngModel',
		required: '=ngRequired',
		disabled: '=ngDisabled',
		nonoDigito:'<',
		ddd: '<'
	},
	require: {
		modelCtrl: '^ngModel'
	},
	templateUrl: 'components/tpl/form/telefone.tpl.html',
	controller: function($attrs){
		var ctrl = this;
		
		if(!ctrl.name){
			var strNgModel = $attrs.ngModel;
			ctrl.name = strNgModel;
		}

		if(!ctrl.nonoDigito){
			ctrl.nonoDigito = false;
		}
		
		if(!ctrl.ddd){
			ctrl.ddd = false;
		}
		
		if(!ctrl.label){
			ctrl.label = 'Telefone'
		}
		
		ctrl.$onInit = function () {
			
			ctrl.onModelInputChange = function(){
				ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
				ctrl.modelCtrl.$render();
			};
			
			ctrl.modelCtrl.$parsers.push(function(valueFromView){
				if(valueFromView){
					return valueFromView.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
				}
			});
			
			ctrl.modelCtrl.$render = function() {
				var digitFormatted = ctrl.modelCtrl.$viewValue;
				
				if(digitFormatted){
					var valueDigit = digitFormatted.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
					
					var pattern = '' ;
					var format = "";
					ctrl.maxlength = 9;					
					
					if(ctrl.ddd){
						ctrl.maxlength += 5;
					} 
					
					if(ctrl.nonoDigito){
						ctrl.maxlength += 2;
					} 
					
					switch(ctrl.maxlength){
						case 11:{//somente com nono digito
							pattern += '(\\d)(\\d{1,4})' ;
							format = "$1.$2";
							
							if(valueDigit.length > 5){
								format += "-$3";
							}
							
							break;
						}
						case 14:{//somente com ddd
							pattern += '(\\d{1,2})(\\d{1,4})?' ;
							
							if(valueDigit.length < 3){
								format = "($1";
							} else {
								format = "($1) $2";
							}
							if(valueDigit.length > 6){
								format += "-$3";
							}
							break;
						}
						case 16:{//tel completo ddd + nono digito
							pattern += '(\\d{1,2})(\\d)?(\\d{1,4})?' ;
							
							if(valueDigit.length < 3){
								format = "($1";
							} else {
								format = "($1) $2";
							}
							if(valueDigit.length > 3){
								format += ".$3";
							}
							if(valueDigit.length > 7){
								format += "-$4";
							}
							
							break;
						}
						default:{//tel comum
							pattern = '(\\d{4})' ;
							format = "$1-$2";
							break;
						}
					}
					
					pattern += '(\\d+)?';
					
					digitFormatted = valueDigit.replace(new RegExp(pattern, 'g'), format);
					digitFormatted = digitFormatted.substring(0,ctrl.maxlength);
					
					ctrl.modelToInput   = digitFormatted;
					 
					/*
					 * Quando a atualizacao vem do model (programaticamente) o setViewValue 
					 * abaixo dispara o parser para colocar o valor correto no model
					 * */
					ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
					 
				} else {
					ctrl.modelToInput   = digitFormatted;
				}
	        };
			
		};
	}
})
.component('cep',{
	bindings: {
		label: '@',
		name: '@',
		tooltip:'<',
		placeholder:'<',
		model: '=ngModel',
		required: '=ngRequired',
		disabled: '=ngDisabled'
	},
	require: {
		modelCtrl: '^ngModel'
	},
	templateUrl: 'components/tpl/form/cep.tpl.html',
	controller: function($attrs){
		var ctrl = this;
		
		if(!ctrl.name){
			var strNgModel = $attrs.ngModel;
			ctrl.name = strNgModel;
		}

		if(!ctrl.label){
			ctrl.label = 'CEP'
		}

		ctrl.$onInit = function () {
			
			ctrl.onModelInputChange = function(){
				ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
				ctrl.modelCtrl.$render();
			};
			
			ctrl.modelCtrl.$parsers.push(function(valueFromView){
				if(valueFromView){
					return valueFromView.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
				}
			});
			
			ctrl.modelCtrl.$render = function() {
				var digitFormatted = ctrl.modelCtrl.$viewValue;
				
				if(digitFormatted){
					var valueDigit = digitFormatted.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
					valueDigit = valueDigit.substring(0,8);
					
					ctrl.maxlength = 10;
					var pattern = '(\\d{2})(\\d+)' ;
					var format = "$1.$2";
					
					if(valueDigit.length > 5){
						pattern = '(\\d{2})(\\d{3})(\\d+)' ;
						ctrl.maxlength = ctrl.maxlength + 2;
						format = "$1.$2-$3";
						
					}
					
					 digitFormatted = valueDigit.replace(new RegExp(pattern, 'g'), format);
					 digitFormatted = digitFormatted.substring(0,ctrl.maxlength);
					
					 ctrl.modelToInput   = digitFormatted;
					 
					 /*
					  * Quando a atualizacao vem do model (programaticamente) o setViewValue 
					  * abaixo dispara o parser para colocar o valor correto no model
					  * */
					 ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
					 
				}else {
					ctrl.modelToInput   = digitFormatted;
				}
	        };
		};
	}
})
.component('cpf',{
	bindings: {
		label: '@',
		name: '@',
		tooltip:'<',
		placeholder:'<',
		model: '=ngModel',
		required: '=ngRequired',
		disabled: '=ngDisabled'
	},
	require: {
		modelCtrl: '^ngModel'
	},
	templateUrl: 'components/tpl/form/cpf.tpl.html',
	controller: function($attrs){
		var ctrl = this;
		
		if(!ctrl.name){
			var strNgModel = $attrs.ngModel;
			ctrl.name = strNgModel;
		}

		if(!ctrl.label){
			ctrl.label = 'CPF'
		}
		
		ctrl.$onInit = function () {
			
			ctrl.onModelInputChange = function(){
				ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
				ctrl.modelCtrl.$render();
			};
			
			ctrl.modelCtrl.$parsers.push(function(valueFromView){
				if(valueFromView){
					return valueFromView.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
				}
			});
			
			ctrl.modelCtrl.$render = function() {
				var digitFormatted = ctrl.modelCtrl.$viewValue;
				if(digitFormatted){
					var valueDigit = digitFormatted.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
					
					ctrl.maxlength = 14;
					var pattern = '(\\d{3})' ;
					var format = "$1";
					
					if(valueDigit.length > 3){
						pattern += '(\\d{1,3})' ;
						format += ".$2";
					}
					if(valueDigit.length > 6){
						pattern += '(\\d{1,3})' ;
						format += ".$3";
					}
					if(valueDigit.length > 9){
						format += "-$4";
					}
					
					pattern += '(\\d+)?';
					
					digitFormatted = valueDigit.replace(new RegExp(pattern, 'g'), format);
					digitFormatted = digitFormatted.substring(0,ctrl.maxlength);
					
					ctrl.modelToInput   = digitFormatted;
					
					/*
					 * Quando a atualizacao vem do model (programaticamente) o setViewValue 
					 * abaixo dispara o parser para colocar o valor correto no model
					 * */
					ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
					
				} else {
					ctrl.modelToInput   = digitFormatted;
				}
			};
		};
	}
})
.component('cnpj',{
	bindings: {
		label: '@',
		name: '@',
		tooltip:'<',
		placeholder:'<',
		model: '=ngModel',
		required: '=ngRequired',
		disabled: '=ngDisabled'
	},
	require: {
		modelCtrl: '^ngModel'
	},
	templateUrl: 'components/tpl/form/cnpj.tpl.html',
	controller: function($attrs){
		var ctrl = this;
		
		if(!ctrl.name){
			var strNgModel = $attrs.ngModel;
			ctrl.name = strNgModel;
		}
		
		if(!ctrl.label){
			ctrl.label = 'CNPJ'
		}
		
		ctrl.$onInit = function () {
			
			ctrl.onModelInputChange = function(){
				ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
				ctrl.modelCtrl.$render();
			};
			
			ctrl.modelCtrl.$parsers.push(function(valueFromView){
				if(valueFromView){
					return valueFromView.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
				}
			});
			
			ctrl.modelCtrl.$render = function() {
				var digitFormatted = ctrl.modelCtrl.$viewValue;
				
				if(digitFormatted){
					var valueDigit = digitFormatted.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
					
					ctrl.maxlength = 18;
					var pattern = '(\\d{2})' ;
					var format = "$1";
					
					if(valueDigit.length > 2){
						pattern += '(\\d{1,3})' ;
						format += ".$2";
					}
					if(valueDigit.length > 5){
						pattern += '(\\d{1,3})' ;
						format += ".$3";
					}
					if(valueDigit.length > 8){
						pattern += '(\\d{1,4})' ;
						format += "/$4";
					}
					if(valueDigit.length > 12){
						format += "-$5";
					}
					
					pattern += '(\\d+)?';
					
					digitFormatted = valueDigit.replace(new RegExp(pattern, 'g'), format);
					digitFormatted = digitFormatted.substring(0,ctrl.maxlength);
					
					ctrl.modelToInput   = digitFormatted;
					
					/*
					 * Quando a atualizacao vem do model (programaticamente) o setViewValue 
					 * abaixo dispara o parser para colocar o valor correto no model
					 * */
					ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
					
				} else {
					ctrl.modelToInput   = digitFormatted;
				}
			};
		};
	}
})
.component('hour',{
	bindings: {
		label: '@',
		name: '@',
		tooltip:'<',
		placeholder:'<',
		model: '=ngModel',
		required: '=ngRequired',
		disabled: '=ngDisabled'
	},
	require: {
		modelCtrl: '^ngModel'
	},
	templateUrl: 'components/tpl/form/hour.tpl.html',
	controller: function($attrs){
		var ctrl = this;
		
		if(!ctrl.name){
			var strNgModel = $attrs.ngModel;
			ctrl.name = strNgModel;
		}

		if(!ctrl.label){
			ctrl.label = 'Hora'
		}
		
		ctrl.$onInit = function () {
			
			ctrl.onModelInputChange = function(){
				ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
				ctrl.modelCtrl.$render();
			};
			
			ctrl.modelCtrl.$parsers.push(function(valueFromView){
				if(valueFromView){
					return valueFromView.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
				}
			});
			
			ctrl.modelCtrl.$render = function() {
				var digitFormatted = ctrl.modelCtrl.$viewValue;
				if(digitFormatted){
					var valueDigit = digitFormatted.replace(new RegExp(/\D/, 'g'),''); // remove todos os caracteres não numéricos.
					valueDigit = valueDigit.substring(0, 4);
					ctrl.maxlength = 5;

					switch(valueDigit.length){
						case 1:{
							if(valueDigit > 2){
								valueDigit = '';
							}
							digitFormatted = valueDigit;
							break;
						}
						case 2:{
							if(valueDigit > 23){
								valueDigit = valueDigit.substring(0,1);
							}
							digitFormatted = valueDigit;
							break;
						}
						case 3:{
							var min1 = valueDigit.substring(2,3);
							if(min1 > 5){
								valueDigit = valueDigit.substring(0,2);
							}
							digitFormatted = valueDigit.substring(0,2)+':' + valueDigit.substring(2,3);
							break;
						}
						case 4:{
							var min = valueDigit.substring(2,4);
							if(min > 59){
								valueDigit = valueDigit.substring(0,3);
							}
							digitFormatted = valueDigit.substring(0,2)+':' + valueDigit.substring(2,4);
							break;
						}
						default:{
							digitFormatted = valueDigit;
//							digitFormatted = valueDigit.substring(0,ctrl.maxlength - 1);;
							break;
						}
					}
					
					digitFormatted = digitFormatted.substring(0,ctrl.maxlength);
					ctrl.modelToInput   = digitFormatted;
					
					/*
					 * Quando a atualizacao vem do model (programaticamente) o setViewValue 
					 * abaixo dispara o parser para colocar o valor correto no model
					 * */
					ctrl.modelCtrl.$setViewValue(ctrl.modelToInput);
					
				} else {
					ctrl.modelToInput   = digitFormatted;
				}
			};
		};
	}
})

.component('date',{
	bindings: {
		label: '@',
		name: '@',
		tooltip:'<',
		placeholder:'<',
		wPhone:'@',
		wTablet:'@',
		wDesktop:'@',
		model: '=ngModel',
		min:'=ngMin',
		max:'=ngMax',
		required: '=ngRequired',
		disabled: '=ngDisabled'
	},
	require: {
		modelCtrl: '^ngModel',
		viewForm: '^form'
	},
	templateUrl: 'components/tpl/form/date/date.tpl.html',
	controller: function($attrs){
		var ctrl = this;
		
		if(!ctrl.name){
			var strNgModel = $attrs.ngModel;
			ctrl.name = strNgModel;
		}
		
		if(!ctrl.label){
			ctrl.label = 'Data';
		}
		
		ctrl.months = [
		         {name: 'Janeiro', value: 0},{name: 'Fevereiro' , value:  1},{name: 'Março'    , value:  2},
		         {name: 'Abril'  , value: 3},{name: 'Maio'      , value:  4},{name: 'Junho'    , value:  5},
		         {name: 'Julho'  , value: 6},{name: 'Agosto'    , value:  7},{name: 'Setembro' , value:  8},
		         {name: 'Outubro', value: 9},{name: 'Novembro'  , value: 10},{name: 'Dezembro' , value: 11},
		     ];
	
		ctrl.weeks = [];
		
		ctrl.$onInit = function(){
			
			if(angular.isNumber(ctrl.model)){
				ctrl.model = new Date(ctrl.model);
			}
			
			ctrl.selectDate( ctrl.model );
		}
		
		ctrl.defineVisible = function(dt){
			
			var date = dt;
			
			if(!date){
				date = new Date();
			}
			
			ctrl.visibleDate = date;			
			ctrl.visibleMonth = ctrl.months[date.getMonth()];
			ctrl.visibleYear = date.getFullYear();
		}

		ctrl.defineCurrent = function(dt){
			
			var date = dt;
			
			if(!date){
				date = new Date();
			}
			
			
			ctrl.defineVisible(date);
			
			ctrl.currentWeekDay = date.getDay();
			ctrl.currentMonth = ctrl.months[date.getMonth()];
			ctrl.currentYear = date.getFullYear();
			
			if(dt){
				ctrl.currentDate = new Date(ctrl.currentYear, ctrl.currentMonth.value, date.getDate());
				ctrl.textDate =  ( date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + 
								'/' + ( ctrl.currentMonth.value >= 9 ? ctrl.currentMonth.value+1 : '0' + (ctrl.currentMonth.value+1)) + 
								'/' + ctrl.currentYear;
				ctrl.model = ctrl.currentDate;
			} else {
				ctrl.model = undefined;
				ctrl.textDate = undefined;
				ctrl.currentDate = undefined;
			}
			
		}
		
		ctrl.previousMonth = function() {
			var selectedDate = ctrl.visibleDate;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			var dateAux = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, '01')
			
			ctrl.printWeeks(dateAux);
			
			ctrl.defineVisible(dateAux);
			
		}
		
		ctrl.nextMonth = function() {
			var selectedDate = ctrl.visibleDate;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			var dateAux = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, '01')
			
			ctrl.printWeeks(dateAux);
			
			ctrl.defineVisible(dateAux);
			
		}
		
		ctrl.previousYear = function() {
			var selectedDate = ctrl.visibleDate;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			var dateAux = new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), '01')
			
			ctrl.printWeeks(dateAux);
			
			ctrl.defineVisible(dateAux);
			
		}
		
		ctrl.nextYear = function() {
			var selectedDate = ctrl.visibleDate;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			var dateAux = new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), '01')
			
			ctrl.printWeeks(dateAux);
			
			ctrl.defineVisible(dateAux);
			
		}
		
		ctrl.selectDate = function(dt){
			console.log('select date');
			if(dt < ctrl.min || dt > ctrl.max ){
				return;
			}
			
			
			var selectedDate = dt;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			ctrl.printWeeks(selectedDate);
			
			if(dt - ctrl.currentDate == 0){
				ctrl.opencalendar = false;
			}
			
			ctrl.defineCurrent(dt);
		}
		
		ctrl.printWeeks = function(selectedDate){
			var startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), '01');
			startDate.setDate(startDate.getDate() - startDate.getDay());
			
			ctrl.weeks = [];
			for(var i=0;i < 6;i++){
				var semana = []; 
				for(var d=0; d < 7 ; d++){
					semana.push(startDate);
					startDate = new Date(startDate);
					startDate.setDate(startDate.getDate() + 1);
				}
				ctrl.weeks.push(semana);
			}
		}
		
		ctrl.applyWidth = function(){
			var classes = '';
			
			if(!ctrl.wPhone){ ctrl.wPhone = 12;} 
			if(!ctrl.wTablet){ ctrl.wTablet = 4;} 
			if(!ctrl.wDesktop){ ctrl.wDesktop = 3;}
			
			classes += ' col-xs-' + ctrl.wPhone;
			classes += ' col-sm-' + ctrl.wTablet;
			classes += ' col-md-' + ctrl.wDesktop;
			
			return classes;
		}
		
		
	}
})
.component('period',{
	bindings: {
		label: '@',
		name: '@',
		tooltip:'<',
		placeholder:'<',
		wPhone:'@',
		wTablet:'@',
		wDesktop:'@',
		model: '=ngModel',
		min:'=ngMin',
		max:'=ngMax',
		required: '=ngRequired',
		disabled: '=ngDisabled'
	},
	require: {
		modelCtrl: '^ngModel',
		viewForm: '^form'
	},
	templateUrl: 'components/tpl/form/date/period.date.tpl.html',
	controller: function($attrs){
		var ctrl = this;
		
		if(!ctrl.name){
			var strNgModel = $attrs.ngModel;
			ctrl.name = strNgModel;
		}
		
		if(!ctrl.label){
			ctrl.label = 'Data2';
		}
		
		ctrl.months = [
		               {name: 'Janeiro', value: 0},{name: 'Fevereiro' , value:  1},{name: 'Março'    , value:  2},
		               {name: 'Abril'  , value: 3},{name: 'Maio'      , value:  4},{name: 'Junho'    , value:  5},
		               {name: 'Julho'  , value: 6},{name: 'Agosto'    , value:  7},{name: 'Setembro' , value:  8},
		               {name: 'Outubro', value: 9},{name: 'Novembro'  , value: 10},{name: 'Dezembro' , value: 11},
		               ];
		
		ctrl.weeks = [];
		
		ctrl.$onInit = function(){
			
			if(angular.isNumber(ctrl.model)){
				ctrl.model = new Date(ctrl.model);
			}
			
			ctrl.selectDate( ctrl.model );
		}
		
		ctrl.defineVisible = function(dt){
			
			var date = dt;
			
			if(!date){
				date = new Date();
			}
			
			ctrl.visibleDate = date;			
			ctrl.visibleMonth = ctrl.months[date.getMonth()];
			ctrl.visibleYear = date.getFullYear();
		}
		
		ctrl.defineCurrent = function(dt){
			
			var date = dt;
			
			if(!date){
				date = new Date();
			}
			
			
			ctrl.defineVisible(date);
			
			ctrl.currentWeekDay = date.getDay();
			ctrl.currentMonth = ctrl.months[date.getMonth()];
			ctrl.currentYear = date.getFullYear();
			
			if(dt){
				ctrl.currentDate = new Date(ctrl.currentYear, ctrl.currentMonth.value, date.getDate());
				ctrl.textDate =  ( date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + 
				'/' + ( ctrl.currentMonth.value >= 9 ? ctrl.currentMonth.value+1 : '0' + (ctrl.currentMonth.value+1)) + 
				'/' + ctrl.currentYear;
				ctrl.model = ctrl.currentDate;
			} else {
				ctrl.model = undefined;
				ctrl.textDate = undefined;
				ctrl.currentDate = undefined;
			}
			
		}
		
		ctrl.previousMonth = function() {
			var selectedDate = ctrl.visibleDate;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			var dateAux = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, '01')
			
			ctrl.printWeeks(dateAux);
			
			ctrl.defineVisible(dateAux);
			
		}
		
		ctrl.nextMonth = function() {
			var selectedDate = ctrl.visibleDate;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			var dateAux = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, '01')
			
			ctrl.printWeeks(dateAux);
			
			ctrl.defineVisible(dateAux);
			
		}
		
		ctrl.previousYear = function() {
			var selectedDate = ctrl.visibleDate;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			var dateAux = new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), '01')
			
			ctrl.printWeeks(dateAux);
			
			ctrl.defineVisible(dateAux);
			
		}
		
		ctrl.nextYear = function() {
			var selectedDate = ctrl.visibleDate;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			var dateAux = new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), '01')
			
			ctrl.printWeeks(dateAux);
			
			ctrl.defineVisible(dateAux);
			
		}
		
		ctrl.selectDate = function(dt){
			console.log('select date');
			if(dt < ctrl.min || dt > ctrl.max ){
				return;
			}
			
			
			var selectedDate = dt;
			
			if(!selectedDate){
				selectedDate = new Date();
			}
			
			ctrl.printWeeks(selectedDate);
			
			if(dt - ctrl.currentDate == 0){
				ctrl.opencalendar = false;
			}
			
			ctrl.defineCurrent(dt);
		}
		
		ctrl.printWeeks = function(selectedDate){
			var startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), '01');
			startDate.setDate(startDate.getDate() - startDate.getDay());
			
			ctrl.weeks = [];
			for(var i=0;i < 6;i++){
				var semana = []; 
				for(var d=0; d < 7 ; d++){
					semana.push(startDate);
					startDate = new Date(startDate);
					startDate.setDate(startDate.getDate() + 1);
				}
				ctrl.weeks.push(semana);
			}
		}
		
		ctrl.applyWidth = function(){
			var classes = '';
			
			if(!ctrl.wPhone){ ctrl.wPhone = 12;} 
			if(!ctrl.wTablet){ ctrl.wTablet = 12;} 
			if(!ctrl.wDesktop){ ctrl.wDesktop = 6;}
			
			classes += ' col-xs-' + ctrl.wPhone;
			classes += ' col-sm-' + ctrl.wTablet;
			classes += ' col-md-' + ctrl.wDesktop;
			
			return classes;
		}
		
		
	}
})
.component('combobox',{
	bindings: {
		label: '@',
		name: '@',
		tooltip:'@',
		options:'=',
		optionId:'@',
		optionDescription:'@',
		
		wPhone:'@',
		wTablet:'@',
		wDesktop:'@',
		model: '=ngModel',
		required: '=ngRequired',
		readonly: '=ngReadonly',
		disabled: '=ngDisabled',
		onchange: '=ngChange'
	},
	require: {
		viewForm: '^form'
	},
	templateUrl: 'components/tpl/form/combobox.tpl.html',
	controller: function($attrs){
		var ctrl = this;
		
		if(!ctrl.name){
			var strNgModel = $attrs.ngModel;
			ctrl.name = strNgModel;
		}
		
		if(!ctrl.optionId){ ctrl.optionId = 'codigo';} 
		if(!ctrl.optionDescription){ ctrl.optionDescription = 'descricao';} 
		
		ctrl.applyWidth = function(){
			var classes = '';
			
			if(!ctrl.wPhone){ ctrl.wPhone = 12;} 
			if(!ctrl.wTablet){ ctrl.wTablet = 8;} 
			if(!ctrl.wDesktop){ ctrl.wDesktop = 6;}
			
			classes += ' col-xs-' + ctrl.wPhone;
			classes += ' col-sm-' + ctrl.wTablet;
			classes += ' col-md-' + ctrl.wDesktop;
			
			return classes;
		}
	}
})

