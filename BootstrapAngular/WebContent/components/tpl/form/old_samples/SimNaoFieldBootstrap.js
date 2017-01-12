/**
 * Created by lucivaldo.costa on 31/08/2016.
 */
angular.module('AtualizacaoCadastral')

.directive('simNaoFieldBootstrap', function () {

      var specialChars = [
        {val:"a",let:"áàãâä"},
        {val:"e",let:"éèêë"},
        {val:"i",let:"íìîï"},
        {val:"o",let:"óòõôö"},
        {val:"u",let:"úùûü"},
        {val:"c",let:"ç"},
        {val:"A",let:"ÁÀÃÂÄ"},
        {val:"E",let:"ÉÈÊË"},
        {val:"I",let:"ÍÌÎÏ"},
        {val:"O",let:"ÓÒÕÔÖ"},
        {val:"U",let:"ÚÙÛÜ"},
        {val:"C",let:"Ç"},
        {val:"",let:"!?@#$%&*()+\\\[\]{}"}
    ];

    /**
     * Função para substituir caractesres especiais.
     * @param {str} string
     * @return String
     */
    function _toInternalName(str) {
        if (str) {
            var regex;
            var returnString = str;
            for (var i = 0; i < specialChars.length; i++) {
                regex = new RegExp("[" + specialChars[i].let + "]", "g");
                returnString = returnString.replace(regex, specialChars[i].val);
                regex = null;
            }
            return returnString.replace(/\s+/g, '');
        } else return '';
    };

    return {
        restrict: 'E',
        require: '^form',
        scope: {
            model: '=ngModel',
            name: '@label',
            req: '=ngRequired',
            ro: '=ngReadonly'
        },                 
        template:  '<div class="form-group"  ng-class="{ \'has-error\' : field.$invalid }"> '+
				   '	<label>{{name}}</label>' +
				   '	<div class="row">'+
				   '		<div class="col-xs-6">'+
				   '			<div class="input-group">'+
				   '				<span class="input-group-addon">'+
				   '					<input ng-readonly="ro" type="radio" name="{{internalName}}" id="{{internalName}}-sim" ng-value="true" ng-model="model" ng-required="req">'+
				   '				</span>'+
				   '				<label for="{{internalName}}-sim" class="form-control">Sim</label>'+
				   '			</div>'+
				   '		</div>'+
				   '		<div class="col-xs-6">'+
				   '			   <div class="input-group">'+
				   '					<span class="input-group-addon">'+
				   '						<input ng-readonly="ro" type="radio" name="{{internalName}}" id="{{internalName}}-nao" ng-value="false" ng-model="model" ng-required="req">'+
				   '					</span>'+
				   '				   <label for="{{internalName}}-nao" class="form-control">Não</label>'+
				   '			   </div>'+
				   '		</div>'+
				   '	</div>'+
				   '	<div ng-messages="field.$error">'+
				   '		<div ng-message="required" class="help-block">O campo \'{{name}}\' é de preenchimento obrigatório.</div>'+
				   '	</div>'+
				   '</div>',
        link: function (scope, element, attrs, form) {
            scope.internalName = _toInternalName(scope.name);
            scope.$watch('scope.model', function(){
            	if(!scope.field){
            		scope.field = form[scope.internalName];
            	}
            });
        }
    };
});