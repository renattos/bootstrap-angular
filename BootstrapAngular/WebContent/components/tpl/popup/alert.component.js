(function () {
    'use strict';

    angular
        .module('component.popup')
        .component('alert', {
            template: "<p>{{$ctrl.msg}}</p>",
            bindings: {
                msg: '<'
            }
        });

})();
