namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.delivery", {
                    url: "/delivery",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientDeliveryMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.delivery.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientDeliveryOverviewLayout"
                }).state("consultation.management.delivery.printpreview", {
                    url: "/print-preview",
                    component: "mrsDeliveryPartogramPreviewPrint"
                })

                // investigations
                .state("consultation.management.delivery.investigations", {
                    url: "/investigations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.delivery.investigations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryInvestigationListLayout"
                }).state("consultation.management.delivery.investigations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientDeliveryInvestigationSelectLayout"
                }).state("consultation.management.delivery.investigations.add", {
                    url: "/:investigationId/add",
                    component: "mrsConsultationPatientDeliveryInvestigationAddLayout"
                }).state("consultation.management.delivery.investigations.edit", {
                    url: "/:personInvestigationId/edit",
                    component: "mrsConsultationPatientDeliveryInvestigationEditLayout"
                })
                .state("consultation.management.delivery.investigations.laboratory", {
                    url: "/:personInvestigationId/laboratory",
                    component: "mrsConsultationPatientDeliveryInvestigationLaboratoryLayout"
                })

                .state("consultation.management.delivery.investigations.tests", {
                    url: "/:personInvestigationId/tests",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.delivery.investigations.tests.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryInvestigationTestListLayout"
                })
                .state("consultation.management.delivery.investigations.tests.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryInvestigationTestAddLayout"
                })
                .state("consultation.management.delivery.investigations.tests.edit", {
                    url: "/:personInvestigationTestId/edit",
                    component: "mrsConsultationPatientDeliveryInvestigationTestEditLayout"
                })
                //  notes
                .state("consultation.management.delivery.notes", {
                    url: "/notes",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.delivery.notes.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryEncounterNoteListLayout"
                }).state("consultation.management.delivery.notes.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryEncounterNoteAddLayout"
                }).state("consultation.management.delivery.notes.edit", {
                    url: "/:encounterNoteId/edit",
                    component: "mrsConsultationPatientDeliveryEncounterNoteEditLayout"
                });


        }
    }

    app.config(Config);

}