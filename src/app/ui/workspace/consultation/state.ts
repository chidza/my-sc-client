namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation", {
                    url: "/:workspaceId",
                    component: "mrsConsultationLayout",
                    abstract: true
                }).state("consultation.workspace", {
                    url: "/queues",
                    component: "mrsWorkspaceLayout"
                }).state("consultation.patients", {
                    url: "/queues/:workareaId",
                    component: "mrsConsultationPatientSelectionLayout"
                })

                 // laboratory
                .state("consultation.laboratory", {
                    url: "/lab-queues",
                    component: "mrsConsultationLaboratory"
                })

                // patient purpose
                .state("consultation.purpose", {
                    url: "/queues/:workareaId/patients/:personId/purpose",
                    component: "mrsConsultationPatientPurposeLayout",
                    abstract: true
                })
                .state("consultation.purpose.list", {
                    url: "/list",
                    component: "mrsConsultationPatientPurposeListLayout"
                })

                // sign off
                .state("consultation.purpose.signoff", {
                    url: "/signoff/:encounterId",
                    component: "mrsConsultationPatientPurposeSignoffLayout",
                    abstract: true
                })

                // patient management
                .state("consultation.management", {
                    url: "/queues/:workareaId/patients/:personId/management/:encounterId",
                    component: "mrsConsultationPatientManagementLayout",
                    abstract: true
                });

        }
    }

    app.config(Config);

}