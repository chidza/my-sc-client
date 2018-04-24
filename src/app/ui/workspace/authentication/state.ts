namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("authentication", {
                    url: "/auth",
                    component: "mrsAuthenticationLayout",
                    abstract: true
                }).state("authentication.login", {
                    url: "/login",
                    component: "mrsLoginDialogLayout"
                }).state("authentication.password", {
                    url: "/password",
                    component: "mrsUserPasswordLayout"
                }).state("authentication.settings", {
                    url: "/settings",
                    component: "mrsUserSettingsLayout"
                });

        }
    }

    app.config(Config);

}