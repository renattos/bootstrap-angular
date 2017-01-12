(function () {
    'use strict';

    angular
        .module('component.popup')
        .component('popupComponent', {
            bindings: {
                popup: '<'
            },
            controller: PopupDirectiveController
        });

    PopupDirectiveController.$inject = ['$scope', '$compile', '$element'];
    function PopupDirectiveController($scope, $compile, $element) {
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

})();
