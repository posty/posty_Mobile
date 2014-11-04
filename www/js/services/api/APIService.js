/**
 * Central Response Handler. All Responses will be intercepted by the add method
 *
 * @class ResponseHandler
 */
define(['angular'], function (angular) {
    "use strict";

    var factory = function ($q, Servers, APIStorageService, Domains) {           

        return {
            
            add: function (server) {
                Servers.add(server);
            },
            
            remove: function (server) {
                Servers.remove(server);
            },
            
            currentServer: function () {
                return Servers.currentServer();
            },
            
            setCurrentServer: function (server) {
                Servers.setCurrentServer(server);
            },
            
            getList: function () {
                return Servers.getList();
            },

            apiIsReachable: function(api) {
                var deferred = $q.defer(); 
                var tmpAPI = this.currentServer();                            
                
                Servers.setCurrentServer(api);

                Domains.refresh().then(function () {              
                    Servers.setCurrentServer(tmpAPI);
                    deferred.resolve();                    
                }).catch(function(response) {
                    Servers.setCurrentServer(tmpAPI);
                    deferred.reject();                    
                });
                return deferred.promise;               
            },

            contiansAPI: function(api) {
                var list = this.getList();                
                for (var i = 0; i < list.length; i++) {
                    if (list[i].caption == api.caption) {
                        return true;
                    }
                }
                return false;        
            },            

            load: function () {  
                APIStorageService.load();
            },

            save: function () {
                APIStorageService.save();
            },

            isItemEditable: function(item) {
                return APIStorageService.isItemEditable(item);             
            },           

        };

    };

    factory.$inject = ['$q', 'Servers', 'APIStorageService', 'Domains'];
    return factory;
});
