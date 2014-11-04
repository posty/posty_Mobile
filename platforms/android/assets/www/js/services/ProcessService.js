define(['angular'], function (angular) {
    "use strict";

    var factory = function () {
        var DUMMY_PUSH_ELEMENT = true;
        var processStack = [];

        return {
            /**
            * pushes the process-stack
            *
            * @method register
            */
            register: function () {
                processStack.push(DUMMY_PUSH_ELEMENT);
            },

            /**
            * pops an element fromt the process-stack
            *
            * @method unregister
            */
            unregister: function () {
                processStack.pop();
            },

            /**
            * refers if the stack is full or not
            *
            * @method isLoading
            * @return {Boolean} true if the stack is not empty
            */
            isLoading: function () {
                return (processStack.length > 0);
            }
        };

    };

    factory.$inject = [];
    return factory;
});