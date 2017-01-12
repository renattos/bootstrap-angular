(function () {
    'use strict';

    angular
        .module('component.popup')
        .component('popupContainer', {
            templateUrl: 'app/components/popups/popup-container.html',
            controller: PopupContainerController
        });

    PopupContainerController.$inject = ['popupService'];
    function PopupContainerController(popupService) {
        var ctrl = this;

        ctrl.popups = popupService.popups;
        ctrl.fechar = fechar;

        function fechar(popup) {
            popupService.retirar(popup);
        }
    }

})();
