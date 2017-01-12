Application = angular.module('FormDemo', ['components'])

.controller('AppCtrl',function($scope){
	$scope.telUsu = '';
	$scope.teste = function(){
		$scope.telUsu += '1112a3a4a56a7a890';
	}

});