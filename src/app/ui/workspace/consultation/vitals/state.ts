namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.vitals", {
                    url: "/vitals",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientVitalMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.vitals.list", {
                    url: "/list",
                    component: "mrsConsultationPatientVitalListLayout"
                }).state("consultation.management.vitals.select", {
                    url: "/select",
                    component: "mrsConsultationPatientVitalSelectLayout"
                }).state("consultation.management.vitals.add", {
                    url: "/:vitalId/add",
                    component: "mrsConsultationPatientVitalAddLayout"
                }).state("consultation.management.vitals.edit", {
                    url: "/:encounterVitalId/edit",
                    component: "mrsConsultationPatientVitalEditLayout"
                }).state("consultation.management.vitals.signoff", {
                    url: "/signoff",
                    component: "mrsConsultationPatientVitalSignOffLayout"
                });

        }
    }

    app.config(Config);

}