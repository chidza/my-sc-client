namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("dashboard", {
                    url: "/dashboard",
                    component: "mrsDashboardLayout"
                });

        }
    }

    app.config(Config);

}