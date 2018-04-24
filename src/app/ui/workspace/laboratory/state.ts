namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("laboratory", {
                    url: "/laboratory",
                    templateUrl: "app/ui/workspace/laboratory/laboratory.html",
                    abstract: true
                })
                .state("laboratory.list", {
                    url: "/search",
                    component: "mrsLaboratorySearch"
                })
                .state("laboratory.edit", {
                    url: "/:labInvestigationId/edit",
                    component: "mrsLaboratoryEdit"
                })/* 
                .state("laboratory.management", {
                    url: "/management/:personId",
                    component: "mrsLaboratoryFileManagement",
                    abstract: true
                })
                // overview
                .state("laboratory.management.overview", {
                    url: "/overview",
                    component: "mrsLaboratoryFileManagementOverview"
                }) */;
        }
    }

    app.config(Config);

}