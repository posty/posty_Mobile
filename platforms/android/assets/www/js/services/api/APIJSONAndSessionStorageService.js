define(['angular', 'text!../../../settings.json'], function (angular, settings) {
    "use strict";

    var factory = function ($q, Servers, StorageService) {      

        var fixedServers = [];  

        var loadFromJSON = function() {
            fixedServers = [];
            
            var SETTINGS = JSON.parse(settings);                    
            
            angular.forEach(SETTINGS.servers, function (server) {
                fixedServers.push(server);
                Servers.add(server);                    
            });            
        } 

        var loadFromStorage = function() {
            var serverList = StorageService.getObject('servers'); 
            for (var i = 0; i < serverList.length; i++) {
                Servers.add(serverList[i]); 
            };               
        }

        var loadCurrentServer = function() {
            var currentServerFromStorage = StorageService.getObject('current_server');
            if (!angular.equals({}, currentServerFromStorage)) {            
                angular.forEach(Servers.getList(), function (server) {                    
                    if (currentServerFromStorage.caption === server.caption)
                        Servers.setCurrentServer(server);    
                });                
            } else {
                if (Servers.getList().length > 0) {
                    var firstElement = Servers.getList()[0];
                    Servers.setCurrentServer(firstElement);                        
                }
            }              
        }

        return {           

            load: function () {                
                var deferred = $q.defer();  
                loadFromJSON();
                loadFromStorage();
                loadCurrentServer(); 
                deferred.resolve();
                return deferred.promise;                     
            },

            save: function () {
                var deferred = $q.defer(); 
                var serversToBeSaved = [];
                angular.forEach(Servers.getList(), function (server) {
                    var itemInFixedServers = fixedServers.indexOf(server); 
                    if (itemInFixedServers < 0)
                        serversToBeSaved.push(server);                              
                });
                StorageService.setObject('servers', serversToBeSaved);
                StorageService.setObject('current_server', Servers.currentServer());
                deferred.resolve();
                return deferred.promise;
            },

            isItemEditable: function(item) {
                var itemInServers = Servers.getList().indexOf(item);
                if (itemInServers < 0)
                    return false;
                var itemInFixedServers = fixedServers.indexOf(item); 
                if (itemInFixedServers > -1)
                    return false;
                return true;             
            }

        };

    };

    factory.$inject = ['$q', 'Servers', 'StorageService'];
    return factory;
});
