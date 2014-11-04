define(['angular', 'text!../../../settings.json'], function (angular, settings) {
    "use strict";

    var factory = function ($q, Servers) {            

        return {           

            load: function () {
                var deferred = $q.defer(); 
                /* Parsing the settings.json to load the settings */
                var SETTINGS = JSON.parse(settings);                    

                /* Adding the possible Server to connect with */
                angular.forEach(SETTINGS.servers, function (server) {
                    Servers.add(server);                    
                });    
                
                if (Servers.getList().length > 0) {
                    var firstElement = Servers.getList()[0];
                    Servers.setCurrentServer(firstElement);                        
                }               
                deferred.resolve();
                return deferred.promise;  
            },

            save: function () {
                var deferred = $q.defer(); 
                /* not available */
                deferred.resolve();
                return deferred.promise;
            },

            isItemEditable: function(item) {
                return false;         
            }

        };

    };

    factory.$inject = ['$q', 'Servers'];
    return factory;
});
