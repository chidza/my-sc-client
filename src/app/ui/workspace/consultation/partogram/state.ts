namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.partogram", {
                    url: "/partogram/delivery/:deliveryId",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientPartogramMenuLayout"
                        }
                        ,
                        workspace: {
                            template: `<div ui-view></div>`
                        }
                    },
                    abstract: true

                }).state("consultation.management.partogram.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientPartogramOverviewLayout"
                }).state("consultation.management.partogram.record", {
                    url: "/:deliveryPartogramId/record",
                    component: "mrsConsultationPatientPartogramRecordLayout"
                }).state("consultation.management.partogram.manage", {
                    url: "/manage",
                    component: "mrsConsultationPatientPartogramManageLayout"
                }).state("consultation.management.partogram.view", {
                    url: "/:deliveryPartogramId/view",
                    component: "mrsConsultationPatientPartogramViewLayout"
                }).state("consultation.management.partogram.alerts", {
                    url: "/alerts",
                    component: "mrsConsultationPatientPartogramAlertsLayout"
                })

                // partogram notes
                .state("consultation.management.partogram.partogramNotes", {
                    url: "/partogram-notes",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.partogram.partogramNotes.list", {
                    url: "/list",
                    component: "mrsConsultationPatientPartogramPartogramNoteListLayout"
                }).state("consultation.management.partogram.partogramNotes.add", {
                    url: "/add",
                    component: "mrsConsultationPatientPartogramPartogramNoteAddLayout"
                }).state("consultation.management.partogram.partogramNotes.edit", {
                    url: "/:partogramNoteId/edit",
                    component: "mrsConsultationPatientPartogramPartogramNoteEditLayout"
                });

        }
    }

    app.config(Config);

}