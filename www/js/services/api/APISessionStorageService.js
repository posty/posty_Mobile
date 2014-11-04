define(['angular'], function (angular) {
    "use strict";

    var factory = function ($q, Servers, StorageService) {        

        return {

            load: function () {  
                var deferred = $q.defer(); 
                var serverList = StorageService.getObject('servers'); 
                for (var i = 0; i < serverList.length; i++) {
                    Servers.add(serverList[i]); 
                };     
                if (StorageService.get('current_server') != null) {
                    Servers.setCurrentServer(StorageService.get('current_server'));    
                } else {
                    if (Servers.getList().length > 0) {
                        var firstElement = Servers.getList()[0];
                        Servers.setCurrentServer(firstElement);                        
                    }
                }    
                deferred.resolve();
                return deferred.promise;             
            },

            save: function () {
                var deferred = $q.defer(); 
                StorageService.setObject('servers', Servers.getList());
                StorageService.setObject('current_server', Servers.currentServer());
                deferred.resolve();
                return deferred.promise;  
            },

            isItemEditable: function(item) {               
                return true;             
            }            

        };

    };

    factory.$inject = ['$q', 'Servers', 'StorageService'];
    return factory;
});
