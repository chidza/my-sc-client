namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.quarterly-hourly", {
                    url: "/quarterly-hourly",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientQuarterHourlyMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.quarterly-hourly.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientQuarterHourlyOverviewLayout"
                })

                // vitals
                .state("consultation.management.quarterly-hourly.vitals", {
                    url: "/vitals",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.quarterly-hourly.vitals.list", {
                    url: "/:quarterHourlyId/list",
                    component: "mrsConsultationPatientQuarterHourlyVitalListLayout"
                }).
                state("consultation.management.quarterly-hourly.vitals.select", {
                    url: "/select",
                    component: "mrsConsultationPatientQuarterHourlyVitalSelectLayout"
                }).
                state("consultation.management.quarterly-hourly.vitals.add", {
                    url: "/:quarterHourlyId/add",
                    component: "mrsConsultationPatientQuarterHourlyVitalAddLayout"
                }).
                state("consultation.management.quarterly-hourly.vitals.edit", {
                    url: "/:quarterHourlyId/edit",
                    component: "mrsConsultationPatientQuarterHourlyVitalEditLayout"
                });

        }
    }

    app.config(Config);

}