/**
 * Central Response Handler. All Responses will be intercepted by the add method
 *
 * @class ResponseHandler
 */
define(['angular'], function (angular) {
    "use strict";

    var factory = function ($state) {

        var STANDARD_HEADER_TEMPLATE_NAME = 'standard-header.html';
        var SEARCH_HEADER_TEMPLATE_NAME = 'search-header.html';

        var title = '';
        var smallLogoIsSet = true;
        var hideBackButton = false;
        var hideSearchButton = true;
        var hideNewButton = true;
        var templateName = STANDARD_HEADER_TEMPLATE_NAME;
        var lastSearchTemplateName = templateName;
        var newClickLink = '';
        var searchText = '';

        return {

            setDefault: function () {
                title = '';
                smallLogoIsSet = true;
                hideBackButton = false;
                hideSearchButton = true;
                hideNewButton = true;
                templateName = STANDARD_HEADER_TEMPLATE_NAME;
                lastSearchTemplateName = templateName;
                newClickLink = '';
                searchText = '';
            },

            setTitle: function (newTitle) {
                title = newTitle;
            },

            getTitle: function () {
                return title;
            },

            smallLogoIsSet: function() {
                return smallLogoIsSet;
            },

            setSmallLogo: function(setLogo) {                
                smallLogoIsSet = setLogo;
            },


            backButtonIsHidden: function() {
                return hideBackButton;
            },

            hideBackButton: function(hide) {
                hideBackButton = hide;
            },

            searchButtonIsHidden: function() {
                return hideSearchButton;
            },

            hideSearchButton: function(hide) {
                hideSearchButton = hide;
            },

            newButtonIsHidden: function() {
                return hideNewButton;
            },

            hideNewButton: function(hide) {
                hideNewButton = hide;
            },

            getTemplateName: function () {
                return templateName;
            },

            setSearch: function () {
                lastSearchTemplateName = templateName;
                templateName = SEARCH_HEADER_TEMPLATE_NAME;
            },

            resetSearch: function () {
                templateName = lastSearchTemplateName;
            },

            getSearchText: function () {
                return searchText;
            },

            setSearchText: function (newSearchText) {
                searchText = newSearchText;
            },

            setNewClickLink: function (linkName) {
                newClickLink = linkName;
            },

            clearNewClickLink: function () {
                newClickLink = '';
            },

            onNewClick: function() {
                if (newClickLink != "") {
                    $state.go(newClickLink);
                }
            }
        };

    };

    factory.$inject = ['$state'];
    return factory;
});
