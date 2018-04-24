namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("reports", {
                    url: "/reports",
                    component: "mrsReportsLayout",
                    abstract: true
                }).state("reports.overview", {
                    url: "/overview",
                    component: "mrsReportsOverviewLayout"
                }).state("reports.viewer", {
                    url: "/:reportId/:from/:to/:week/:year",
                    component: "mrsReportsViewerLayout"
                }).state("reports.partogram", {
                    url: "/partogram",
                    component: "mrsReportsPartogramLayout"
                }).state("reports.preview", {
                    url: "/partogram/:deliveryId",
                    // template:"we previewing"
                    component: "mrsDeliveryPartogramPreview"
                });

        }
    }

    app.config(Config);

}