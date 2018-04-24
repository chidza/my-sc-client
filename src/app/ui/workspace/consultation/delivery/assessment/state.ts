namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.deliveryAssessment", {
                    url: "/delivery/:deliveryId/initial-assessment",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientDeliveryAssessmentMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.deliveryAssessment.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientDeliveryAssessmentOverviewLayout"
                }).state("consultation.management.deliveryAssessment.general", {
                    url: "/general-examinations",
                    component: "mrsConsultationPatientDeliveryAssessmentGeneralLayout"
                }).state("consultation.management.deliveryAssessment.vaginal", {
                    url: "/vaginal-examinations",
                    component: "mrsConsultationPatientDeliveryAssessmentVaginalLayout"
                })

                // investigations
                .state("consultation.management.deliveryAssessment.investigations", {
                    url: "/investigations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliveryAssessment.investigations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryAssessmentInvestigationListLayout"
                }).state("consultation.management.deliveryAssessment.investigations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientDeliveryAssessmentInvestigationSelectLayout"
                }).state("consultation.management.deliveryAssessment.investigations.add", {
                    url: "/:investigationId/add",
                    component: "mrsConsultationPatientDeliveryAssessmentInvestigationAddLayout"
                }).state("consultation.management.deliveryAssessment.investigations.edit", {
                    url: "/:personInvestigationId/edit",
                    component: "mrsConsultationPatientDeliveryAssessmentInvestigationEditLayout"
                })
                .state("consultation.management.deliveryAssessment.investigations.laboratory", {
                    url: "/:personInvestigationId/laboratory",
                    component: "mrsConsultationPatientDeliveryAssessmentInvestigationLaboratoryLayout"
                })

                .state("consultation.management.deliveryAssessment.investigations.tests", {
                    url: "/:personInvestigationId/tests",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.deliveryAssessment.investigations.tests.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryAssessmentInvestigationTestListLayout"
                })
                .state("consultation.management.deliveryAssessment.investigations.tests.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryAssessmentInvestigationTestAddLayout"
                })
                .state("consultation.management.deliveryAssessment.investigations.tests.edit", {
                    url: "/:personInvestigationTestId/edit",
                    component: "mrsConsultationPatientDeliveryAssessmentInvestigationTestEditLayout"
                })
                ;

        }
    }

    app.config(Config);

}