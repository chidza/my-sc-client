namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.deliveryPartogram", {
                    url: "/delivery/:deliveryId/partogram",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientDeliveryPartogramMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.deliveryPartogram.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientDeliveryPartogramOverviewLayout"
                }).state("consultation.management.deliveryPartogram.record", {
                    url: "/:deliveryPartogramId/record",
                    component: "mrsConsultationPatientDeliveryPartogramRecordLayout"
                }).state("consultation.management.deliveryPartogram.manage", {
                    url: "/manage",
                    component: "mrsConsultationPatientDeliveryPartogramManageLayout"
                }).state("consultation.management.deliveryPartogram.view", {
                    url: "/:deliveryPartogramId/view",
                    component: "mrsConsultationPatientDeliveryPartogramViewLayout"
                }).state("consultation.management.deliveryPartogram.alerts", {
                    url: "/alerts",
                    component: "mrsConsultationPatientDeliveryPartogramAlertsLayout"
                })

                // partogram notes
                .state("consultation.management.deliveryPartogram.partogramNotes", {
                    url: "/partogram-notes",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliveryPartogram.partogramNotes.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryPartogramPartogramNoteListLayout"
                }).state("consultation.management.deliveryPartogram.partogramNotes.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryPartogramPartogramNoteAddLayout"
                }).state("consultation.management.deliveryPartogram.partogramNotes.edit", {
                    url: "/:partogramNoteId/edit",
                    component: "mrsConsultationPatientDeliveryPartogramPartogramNoteEditLayout"
                });

        }
    }

    app.config(Config);

}