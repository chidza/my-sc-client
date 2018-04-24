namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("administration", {
                    url: "/admin",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("administration.user", {
                    url: "/users",
                    component: "mrsUserLayout"
                }).state("administration.configuration", {
                    url: "/configuration",
                    component: "mrsConfigurationLayout"
                }).state("administration.health", {
                    url: "/health",
                    component: "mrsHealthLayout"
                }).state("administration.site", {
                    url: "/site-settings",
                    template: "<div ui-view></div>"
                }).state("administration.site.list", {
                    url: "/list",
                    component: "mrsSiteSettingListLayout"
                }).state("administration.site.edit", {
                    url: "/:siteSettingId/edit",
                    component: "mrsSiteSettingEditLayout"
                });

        }
    }

    app.config(Config);

}