/*!
 * posty_webModel
 *
 * Copyright 2014 posty-soft.org
 * Licensed under the LGPL v3
 * https://www.gnu.org/licenses/lgpl.html
 *
 */
'use strict';

var app = angular.module('postySoft.models', []);

/**
 * filters the error-messages of the response and returns the concated messages
 *
 * @method  @return {String} Returns the error-message
 */
var errorMsg = function (response) {
    var result = "";
    for (var prop in response) {
        if (response.hasOwnProperty(prop)) {
            result = result + ". " + response[prop];
        }
    }
    return result.substr(2, result.length) + ".";
};

/**
 * central alert-service. Stores a list of alerts (type and message)
 *
 * @class AlertService
 */
app.factory('AlertService', ['$timeout', function ($timeout) {
    var alerts = [];
    var DELETE_ALERT_INTERVAL = 10000; // Time in ms when an Alert will be dropped out of the List

    /**
     * pops the first element out of the alert-list
     *
     * @method popFirst
     */
    var popFirst = function () {
        alerts.splice(0, 1);
    }

    return {
        /**
         * add an alert to the service
         * and set a timeout that removes the alert out of the alert-list
         *
         * @method addAlert
         * @param type {String} the type of the message (info, error, confirmation)
         * @param msg {String} the message-text
         */
        addAlert: function (type, msg) {
            var element = alerts.push({'type': type, 'msg': msg});
            $timeout(popFirst, DELETE_ALERT_INTERVAL);
        },

        /**
         * closes an alert by index of the alert-list
         *
         * @method closeAlert
         * @param index {int} index of the element which should be closed
         */
        closeAlert: function (index) {
            alerts.splice(index, 1);
        },

        /**
         * clears the alert-list
         *
         * @method clearAlerts
         */
        clearAlerts: function () {
            alerts = [];
        },

        /**
         * refers the alert-list
         *
         * @method alerts
         * @return {Array} the list of all alerts
         */
        alerts: function () {
            return alerts;
        }
    };
}]);

/**
 * central Server-model.
 * This Service contains the available Servers and operations on it
 *
 * @class Servers
 */
app.factory('Servers', ['Restangular', function (Restangular) {
    var list = [];

    var DEFAULT_SERVER = {
        url: "",
        key: ""
    }; 

    var currentServer = DEFAULT_SERVER;

    return {
        /**
         * adds a server
         *
         * @method add
         * @param server {Object} server-Object
         */
        add: function (server) {
            list.push(server);
        },
        /**
         * removes a server
         *
         * @method remove
         * @param server {Object} server-Object
         */
        remove: function (server) {
            var index = list.indexOf(server);
            if (index > -1) {
                list.splice(index, 1);
            }
        },

        /**
         * clears all servers
         *
         * @method clear         
         */
        clear: function () {
            list = [];
        },        
        /**
         * returns the current server
         *
         * @method currentServer
         * @return {Object} Returns the current server
         */
        currentServer: function () {
            return currentServer;
        },
        /**
         * sets the current server
         *
         * @method setCurrentServer
         * @param value {Object} the new current server
         */
        setCurrentServer: function (server) {
            if (server != currentServer) {
                currentServer = server;
                Restangular.setBaseUrl(server.url);
                Restangular.setDefaultHeaders(
                    {
                        'Content-Type': 'application/json',
                        'auth_token': server.key
                    }
                );
            }
        },
        /**
         * get the list of all servers
         *
         * @method getList
         * @return {Array} Returns list-member
         */
        getList: function () {
            return list;
        },
        /**
         * more than one server is saved
         *
         * @method moreThanOneServer
         * @return {Boolean} Returns true if the there are more than one server saved
         */
        moreThanOneServer: function () {
            return list.length > 1;
        },
        /**
         * valid Server is set
         *
         * @method isValid
         * @return {Boolean} Returns true if the current Server is valid
         */
        isValid: function () {
            return currentServer != null;
        }
    };
}]);

/**
 * central domain-model. Here you do all the CRUD-operations with the REST-API
 *
 * @class Domains
 */
app.factory('Domains', ['$q', 'Restangular', 'AlertService', function ($q, Restangular, AlertService) {

    var ALL_DOMAINS = {
        name: "all Domains"
    };

    var currentDomain = ALL_DOMAINS; 
    var list = []; 
    var realDataList = []; // list of all data before it is edited
    var observerList = []; // observer for switching the current-domain

    var notifyObservers = function () { 
        for (var i = 0; i < observerList.length; i++) {
            observerList[i].update();
        }
    };

    var containsObserver = function (observer) { 
        for (var i = 0; i < observerList.length; i++) {
            if (observerList[i].getName() === observer.getName()) {
                return true;
            }
        }
        return false;
    }

    var refresh = function () {
        var deferred = $q.defer();
        list = [];
        realDataList = [];
        var dao = Restangular.all('domains');
        dao.getList().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                realDataList.push(angular.copy(data[i]));
                list.push(data[i].virtual_domain);
            }
            deferred.resolve(list);
        }, function (response) {        	
            deferred.reject({
            	msg: "Error refrehsing the domains!", 
            	response: response
            });        	
        });
        return deferred.promise;
    };

    var oldDomainByID = function (id) { 
        for (var i = 0; i < realDataList.length; i++) {
            if (realDataList[i].virtual_domain.id == id) {
                return realDataList[i].virtual_domain;
            }
        }
    };

    return {
        ALL_DOMAINS: ALL_DOMAINS,
        /**
         * returns if the domain is valid or not
         *
         * @method isValid
         * @param domain {Object} the domain
         * @return {Boolean} Returns true if the domain is valid
         */
        isValid: function (domain) {
            return (domain && domain != ALL_DOMAINS);
        },
        /**
         * returns if all domains are selected or not
         *
         * @method allDomainsSelected
         * @return {Boolean} Returns true if currentDomain == ALL_DOMAINS
         */
        allDomainsSelected: function () {
            return (currentDomain == ALL_DOMAINS);
        },
        /**
         * returns the current domain
         *
         * @method currentDomain
         * @return {Object} Returns the current domain
         */
        currentDomain: function () {
            return currentDomain;
        },
        /**
         * sets the current domain
         *
         * @method setCurrentDomain
         * @param value {Object} the new current domain
         */
        setCurrentDomain: function (value) {
            if (value != currentDomain) {
                currentDomain = value;
                notifyObservers();
            }
        },
        /**
         * creates a new domain
         *
         * @method createDomain
         * @param domain {Object} the domain-object
         * @return {Object} returns a promise
         */
        create: function (domain) {
            var deferred = $q.defer();
            var dao = Restangular.all('domains');
            dao.post(domain).then(function (response) {
                var msg = "New domain created: " + domain.name;
                AlertService.addAlert("success", msg);
                currentDomain = ALL_DOMAINS;
                refresh().then(function () {
                    deferred.resolve(response.domain);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error saving the domain " + domain.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * edit a existing domain
         *
         * @method edit
         * @param domain {Object} the domain-object
         * @return {Object} returns a promise
         */
        edit: function (domain) {
            var deferred = $q.defer();
            var oldDomain = oldDomainByID(domain.id);
            var dao = Restangular.one('domains', oldDomain.name);
            dao.name = domain.name;
            dao.put().then(function (response) {
                var msg = "Domain " + domain.name + " updated!";
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(domain);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error updating the domain " + domain.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);                
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * remove a existing domain
         *
         * @method removeDomain
         * @param domain {Object} the domain-object
         * @return {Object} returns a promise
         */
        remove: function (domain) {
            var deferred = $q.defer();
            var dao = Restangular.one('domains', domain.name);
            dao.remove().then(function (response) {
                var msg = "Domain " + domain.name + " deleted!";
                AlertService.addAlert("success", msg);
                if (domain == currentDomain)
                    currentDomain = ALL_DOMAINS;
                refresh().then(function () {
                    deferred.resolve(domain);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error deleting the domain " + domain.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * get the list of all domains
         *
         * @method getlist
         * @return {Array} Returns the list-member
         */
        getList: function () {
            return list;
        },
        /**
         * get the domain by ID or null
         *
         * @method getByID
         * @param id {Object} the domain-id
         * @return {Object} Returns the domain-object or null
         */
        getByID: function (id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    return list[i];
                }
            }
            return null;
        },
        /**
         * refreshes the List
         *
         * @method refresh
         * @return {Object} returns a promise
         */
        refresh: function () {
            return refresh();
        },
        /**
         * register observers for the currentDomain change event
         *
         * @method registerCurrentDomainObserver
         * @param observer {Object} observer-Objecter with update-Method
         */
        registerCurrentDomainObserver: function (observer) {
            if (!containsObserver(observer)) {
                observerList.push(observer);
            }
        },
        /**
         * unregister observers for the currentDomain change event
         *
         * @method unregisterCurrentDomainObserver
         * @param observer {Object} observer-Objecter with update-Method
         */
        unregisterCurrentDomainObserver: function (observer) {
            var index = observerList.indexOf(observer);
            if (index > -1) {
                observerList.splice(index, 1);
            }
        }
    };
}]);

/**
 * central DomainAliasses-model. Here you do all the CRUD-operations with the REST-API
 *
 * @class DomainAliasses
 */
app.factory('DomainAliasses', ['$q', 'Restangular', 'AlertService', 'Domains', function ($q, Restangular, AlertService, Domains) {
    var list = [];	

    var domain = null; 

    var refresh = function () {
        var deferred = $q.defer();
        list = [];
        if (Domains.isValid(domain)) {
            Restangular.one('domains', domain.name).all('aliases').getList().then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i].virtual_domain_alias);
                }
                deferred.resolve(list);
			}, function (response) {        	
				deferred.reject({
					msg: "Error refrehsing the domain aliasses!", 
					response: response
				});        	
			});
        }
        return deferred.promise;
    };

    return {
        /**
         * set the domain
         *
         * @method setDomain
         * @param newDomain {Object} the domain object
         */
        setDomain: function (newDomain) {
            if (domain != newDomain) {
                domain = newDomain;
            }
        },
        /**
         * get the domain
         *
         * @method getDomain
         */
        getDomain: function () {
            return domain;
        },
        /**
         * creates an new domain-alias
         *
         * @method create
         * @param alias {Object} the alias object
         * @return {Object} returns a promise
         */
        create: function (alias) {
            var deferred = $q.defer();
            var dao = Restangular.one('domains', domain.name).all('aliases');
            dao.post(alias).then(function (response) {
                var msg = "New domain alias created: " + alias.name;
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(response.alias);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error saving the domain alias " + alias.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * remove an existing alias
         *
         * @method remove
         * @param alias {Object} the alias object
         * @return {Object} returns a promise
         */
        remove: function (alias) {
            var deferred = $q.defer();
            var dao = Restangular.one('domains', domain.name).one('aliases', alias.name);
            dao.remove().then(function (response) {
                var msg = "Domain alias " + alias.name + " deleted!";
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(alias);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error deleting the domain alias " + alias.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * get the list of all aliases
         *
         * @method getList
         * @return {Array} Returns the list-member
         */
        getList: function () {
            return list;
        },
        /**
         * get the alias by ID or null
         *
         * @method getByID
         * @param id {Object} the alias-id
         * @return {Object} Returns the alias-object or null
         */
        getByID: function (id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    return list[i];
                }
            }
            return null;
        },

        /**
         * refreshes the list
         *
         * @method refresh
         * @return {Object} returns a promise
         */
        refresh: function () {
            return refresh();
        }
    };
}]);

/**
 * central Transport-model. Here you do all the CRUD-operations with the REST-API
 *
 * @class Transports
 */
app.factory('Transports', ['$q', 'Restangular', 'AlertService', function ($q, Restangular, AlertService) {
    var list = [];	
    var realDataList = []; 

    var refresh = function () { 
    	var deferred = $q.defer();
        list = [];
        realDataList = [];
        var dao = Restangular.all('transports');
        dao.getList().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                realDataList.push(angular.copy(data[i]));
                list.push(data[i].virtual_transport);
            }
            deferred.resolve(list);
        }, function (response) {        	
            deferred.reject({
            	msg: "Error refrehsing the transports!", 
            	response: response
            });        	
        });
        return deferred.promise;
    };

    var oldItemByID = function (id) { 
        for (var i = 0; i < realDataList.length; i++) {
            if (realDataList[i].virtual_transport.id == id) {
                return realDataList[i].virtual_transport;
            }
        }
    };

    return {
        /**
         * creates a new transport
         *
         * @method create
         * @param transport {Object} the transport object
         * @return {Object} returns a promise
         */
        create: function (transport) {
        	var deferred = $q.defer();
            var dao = Restangular.all('transports');
            dao.post(transport).then(function (response) {
                var msg = "New transport created: " + transport.name;
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(response.transport);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error saving the transport " + transport.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * edit a existing tranpsort
         *
         * @method edit
         * @param transport {Object} the transport object
         * @return {Object} returns a promise
         */
        edit: function (transport) {
        	var deferred = $q.defer();
            var oldItem = oldItemByID(transport.id);
            var dao = Restangular.one('transports', oldItem.name);
            dao.name = transport.name;
            dao.destination = transport.destination;
            dao.put().then(function (response) {
                var msg = "Transport " + transport.name + " updated!";
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(transport);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error updating the transport " + transport.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);                
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * remove an existing transport
         *
         * @method remove
         * @param alias {Object} the alias object
         * @return {Object} returns a promise
         */
        remove: function (transport) {
        	var deferred = $q.defer();
            var dao = Restangular.one('transports', transport.name);
            dao.remove().then(function (response) {
                var msg = "Transport " + transport.name + " deleted!";
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(transport);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error deleting the transport " + transport.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * get the list of all transports
         *
         * @method getList
         * @return {Array} Returns the aliasList-member         
         */
        getList: function () {
            return list;
        },
        /**
         * get the transport by ID or null
         *
         * @method getByID
         * @param id {Object} the transport-id
         * @return {Object} Returns the transport-object or null
         */
        getByID: function (id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    return list[i];
                }
            }
            return null;
        },        
        /**
         * refreshes the list
         *
         * @method refresh
         * @return {Object} returns a promise
         */
        refresh: function () {
            return refresh();
        }
    };
}]);

/**
 * central Transport-model. Here you do all the CRUD-operations with the REST-API
 *
 * @class Transports
 */
app.factory('Users', ['$q', 'Restangular', 'AlertService', 'Domains', function ($q, Restangular, AlertService, Domains) {
    var list = [];	
    var realDataList = []; 
    var domain = null;

    var refresh = function () {
    	var deferred = $q.defer();
        list = [];
        realDataList = [];
        if (Domains.isValid(domain)) {
            Restangular.one('domains', domain.name).all('users').getList().then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    realDataList.push(angular.copy(data[i]));
                    list.push(data[i].virtual_user);
                }
                deferred.resolve(list);
            }, function (response) {        	
            deferred.reject({
            	msg: "Error refreshing the users!", 
            	response: response
            });        	
        });
        }
        return deferred.promise;
    };

    var oldItemByID = function (id) {
        for (var i = 0; i < realDataList.length; i++) {
            if (realDataList[i].virtual_user.id == id) {
                return realDataList[i].virtual_user;
            }
        }
    };

    return {
        /**
         * returns if the user is valid or not
         *
         * @method isValid
         * @param user {Object} the user
         * @return {Boolean} Returns true if the user is valid
         */
        isValid: function (user) {
            return (user != null);
        },
        /**
         * set the domain
         *
         * @method setDomain
         * @param newDomain {Object} the domain object
         */
        setDomain: function (newDomain) {
            if (domain != newDomain) {
                domain = newDomain;
            }
        },
        /**
         * get the domain
         *
         * @method getDomain
         */
        getDomain: function () {
            return domain;
        },
        /**
         * creates a new user
         *
         * @method create
         * @param user {Object} the user object
         * @return {Object} returns a promise
         */
        create: function (user) {
        	var deferred = $q.defer();
            var dao = Restangular.one('domains', domain.name).all('users');
            dao.post(user).then(function (response) {
                var msg = "New user created: " + user.name;
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(response.user);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error saving the user " + user.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * edit a existing user
         *
         * @method edit
         * @param user {Object} the user object
         * @return {Object} returns a promise
         */
        edit: function (user) {
        	var deferred = $q.defer();
            var oldItem = oldItemByID(user.id);
            var dao = Restangular.one('domains', domain.name).one('users', oldItem.name);
            dao.name = user.name;
            dao.quota = user.quota;
            if (user.password != dao.password)
                dao.password = user.password;
            dao.put().then(function (response) {
                var msg = "User " + user.name + " updated!";
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(domain);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error updating the user " + user.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);                
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * remove an existing user
         *
         * @method remove
         * @param alias {Object} the user object
         * @return {Object} returns a promise
         */
        remove: function (user) {
        	var deferred = $q.defer();
            var dao = Restangular.one('domains', domain.name).one('users', user.name);
            dao.remove().then(function (response) {
                var msg = "User " + user.name + " deleted!";
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(domain);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error deleting the user " + user.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * get the list of all users
         *
         * @method getList
         * @return {Array} Returns the list-member
         */
        getList: function () {
            return list;
        },
        /**
         * get the user by ID or null
         *
         * @method getByID
         * @param id {Object} the user-id
         * @return {Object} Returns the user-object or null
         */
        getByID: function (id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    return list[i];
                }
            }
            return null;
        },        
        /**
         * refreshes the list
         *
         * @method refresh
         * @return {Object} returns a promise
         */
        refresh: function () {
            return refresh();
        }
    };
}]);

/**
 * central UserAliasses-model. Here you do all the CRUD-operations with the REST-API
 *
 * @class UserAliasses
 */
app.factory('UserAliasses', ['$q', 'Restangular', 'AlertService', 'Domains', 'Users', function ($q, Restangular, AlertService, Domains, Users) {
    var list = [];	
    var domain = null;
    var user = null;

    var refresh = function () { 
    	var deferred = $q.defer();
        list = [];
        if (Domains.isValid(domain) && Users.isValid(user)) {
            Restangular.one('domains', domain.name).one('users', user.name).all('aliases').getList().then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i].virtual_user_alias);
                }
                deferred.resolve(list);
			}, function (response) {        	
				deferred.reject({
					msg: "Error refrehsing the user aliasses!", 
					response: response
				});        	
			});
        }
        return deferred.promise;
    };

    return {
        /**
         * set the domain
         *
         * @method setDomain
         * @param newDomain {Object} the domain object         
         */
        setDomain: function (newDomain) {
            if (domain != newDomain) {
                domain = newDomain;
            }
        },
        /**
         * get the domain
         *
         * @method getDomain
         */
        getDomain: function () {
            return domain;
        },
        /**
         * set the user
         *
         * @method setUser
         * @param newUser {Object} the user object         
         */
        setUser: function (newUser) {
            if (user != newUser) {
                user = newUser;
            }
        },
        /**
         * get the user
         *
         * @method getUser
         */
        getUser: function () {
            return user;
        },
        /**
         * creates an new user-alias
         *
         * @method create
         * @param alias {Object} the alias object
         * @return {Object} returns a promise
         */
        create: function (alias) {
        	var deferred = $q.defer();
            var dao = Restangular.one('domains', domain.name).one('users', user.name).all('aliases');
            dao.post(alias).then(function (response) {
                var msg = "New user alias created: " + alias.name;
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(response.alias);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error saving the user alias " + alias.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * remove an existing alias
         *
         * @method remove
         * @param alias {Object} the alias object
         * @return {Object} returns a promise
         */
        remove: function (alias) {
        	var deferred = $q.defer();
            var dao = Restangular.one('domains', domain.name).one('users', user.name).one('aliases', alias.name);
            dao.remove().then(function (response) {
                var msg = "User alias " + alias.name + " deleted!";
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(alias);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error deleting the user alias " + alias.name + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
					msg: msg, 
            		response: response
                });
            });
            return deferred.promise;
        },
        /**
         * get the list of all aliases
         *
         * @method getList
         * @return {Array} Returns the list-member
         */
        getList: function () {
            return list;
        },
        /**
         * get the alias by ID or null
         *
         * @method getByID
         * @param id {Object} the alias-id
         * @return {Object} Returns the alias-object or null
         */
        getByID: function (id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    return list[i];
                }
            }
            return null;
        },         
        /**
         * refreshes the list
         *
         * @method refresh
         * @return {Object} returns a promise
         */
        refresh: function () {
            return refresh();
        }
    };
}]);

/**
 * central Summaries-model. Here you do all the CRUD-operations with the REST-API
 *
 * @class Summaries
 */
app.factory('Summaries', ['$q', 'Restangular', function ($q, Restangular) {
    var list = [];

    var refresh = function () {
    	var deferred = $q.defer();
        list = [];
        Restangular.all('summary').getList().then(function (items) {
            angular.forEach(items, function (item) {
                var data = new Object;
                data.value = item.count;
                data.percent = item.count;
                data.name = item.name;
                data.caption = item.name + ": " + item.count.toFixed(0);
                list.push(data);
            });
            deferred.resolve(list);
		}, function (response) {        	
			deferred.reject({
				msg: "Error refrehsing the summary!", 
				response: response
			});        	
		});
        return deferred.promise;
    };

    return {
        /**
         * get the list of all summary-entries
         *
         * @method getList
         * @return {Array} Returns the list-member
         */
        getList: function () {
            return list;
        },
        /**
         * refreshes the list
         *
         * @method refresh
         * @return {Object} returns a promise
         */
        refresh: function () {
            return refresh();
        }
    };
}]);

/**
 * central ApiKeys-model. Here you do all the CRUD-operations with the REST-API
 *
 * @class ApiKeys
 */
app.factory('ApiKeys', ['$q', 'Restangular', 'AlertService', function ($q, Restangular, AlertService) {
    var list = [];	
    var realDataList = []; 

    var refresh = function () { 
    	var deferred = $q.defer();
        list = [];
        realDataList = [];
        Restangular.all('api_keys').getList().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                realDataList.push(angular.copy(data[i]));
                list.push(data[i].api_key);
            }
            deferred.resolve(list);
        }, function (response) {            
            deferred.reject({
                msg: "Error refrehsing the api-keys!", 
                response: response
            });         
        });
        return deferred.promise;
    };

    var oldItemByID = function (id) {
        for (var i = 0; i < realDataList.length; i++) {
            if (realDataList[i].api_key.id == id) {
                return realDataList[i].api_key;
            }
        }
    };

    return {
        /**
         * creates an new api-key
         *
         * @method create
         * @param apiKey {Object} the api-key object
         * @return {Object} returns a promise
         */
        create: function (apiKey) {
        	var deferred = $q.defer();
            var dao = Restangular.all('api_keys');
            dao.post(apiKey).then(function (response) {            	
                var msg = "New api-key created: " + response.api_key.access_token;
                AlertService.addAlert("success", msg);
				refresh().then(function () {
                    deferred.resolve(response.api_key);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error saving the api-key " + response.api_key.access_token + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
                    msg: msg, 
                    response: response
                });
            });
            return deferred.promise;
        },
        /**
         * edit a existing api-key
         *
         * @method edit
         * @param apiKey {Object} the api-key object
         * @return {Object} returns a promise
         */
        edit: function (apiKey) {
        	var deferred = $q.defer();
            var dao = Restangular.one('api_keys', apiKey.access_token);
            dao.expires_at = apiKey.expires_at;
            dao.active = Number(apiKey.active);
            dao.put().then(function (response) {
                var msg = "Api-key " + apiKey.access_token + " updated!";
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(apiKey);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error updating the api-key " + apiKey.access_token + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
                    msg: msg, 
                    response: response
                });
            });
            return deferred.promise;
        },
        /**
         * remove an existing api-key
         *
         * @method remove
         * @param apiKey {Object} the api-key object
         * @return {Object} returns a promise
         */
        remove: function (apiKey) {
        	var deferred = $q.defer();
            var dao = Restangular.one('api_keys', apiKey.access_token);
            dao.remove().then(function (response) {
                var msg = "Api-key " + apiKey.access_token + " deleted!";
                AlertService.addAlert("success", msg);
                refresh().then(function () {
                    deferred.resolve(apiKey);
                }, function (response) {
                    deferred.reject(response);
                });
            }, function (response) {
                var msg = "There was an error deleting the api-key " + apiKey.access_token + ": \n" + errorMsg(response.data.error);
                AlertService.addAlert("danger", msg);
                deferred.reject({
                    msg: msg, 
                    response: response
                });
            });
            return deferred.promise;
        },
        /**
         * get the list of all api-keys
         *
         * @method getList
         * @return {Array} Returns list-member
         */
        getList: function () {
            return list;
        },
        /**
         * get the api-key by ID or null
         *
         * @method getByID
         * @param id {Object} the api-key-id
         * @return {Object} Returns the api-key-object or null
         */
        getByID: function (id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    return list[i];
                }
            }
            return null;
        },   
        /**
         * refreshes the list
         *
         * @method refresh
         * @return {Object} returns a promise
         */
        refresh: function () {
            return refresh();
        },
        /**
         * check if the api-key is expired
         *
         * @method isExpired
         * @param apiKey {Object} the api-key object
         * @return {Object} returns true if the api-key is expired
         */
        isExpired: function (apiKey) {
            var today = new Date();
            var date = new Date(apiKey.expires_at);
            return date - today < 0;
        }
    };
}]);