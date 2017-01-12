(function () {
    'use strict';

    angular
        .module('component.popup')
        .service('popupService', popupService);

    function popupService() {
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
            _.remove(service.popups, function (popup) {
                return popup.config == popupConfig;
            });
        };
    }

})();
