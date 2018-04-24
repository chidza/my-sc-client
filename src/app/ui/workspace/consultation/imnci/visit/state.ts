namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.imncivisit", {
                    url: "/:imnciVisitId/visit",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientImnciVisitMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.imncivisit.danger", {
                    url: "/danger-signs",
                    component: "mrsConsultationPatientImnciVisitDangerLayout"
                }).state("consultation.management.imncivisit.cough", {
                    url: "/cough",
                    component: "mrsConsultationPatientImnciVisitCoughLayout"
                }).state("consultation.management.imncivisit.diarrhoea", {
                    url: "/diarrhoea",
                    component: "mrsConsultationPatientImnciVisitDiarrhoeaLayout"
                }).state("consultation.management.imncivisit.fever", {
                    url: "/fever",
                    component: "mrsConsultationPatientImnciVisitFeverLayout"
                }).state("consultation.management.imncivisit.ear", {
                    url: "/ear-problems",
                    component: "mrsConsultationPatientImnciVisitEarLayout"
                }).state("consultation.management.imncivisit.feeding", {
                    url: "/feeding",
                    component: "mrsConsultationPatientImnciVisitFeedingLayout"
                }).state("consultation.management.imncivisit.nutrition", {
                    url: "/nutrition-and-aenemia",
                    component: "mrsConsultationPatientImnciVisitNutritionLayout"
                }).state("consultation.management.imncivisit.immunisation", {
                    url: "/immunisations",
                    component: "mrsConsultationPatientImnciVisitImmunisationLayout"
                }).state("consultation.management.imncivisit.hiv", {
                    url: "/hiv",
                    component: "mrsConsultationPatientImnciVisitHivLayout"
                })

                // diagnoses
                .state("consultation.management.imncivisit.diagnoses", {
                    url: "/diagnoses",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.imncivisit.diagnoses.list", {
                    url: "/list",
                    component: "mrsConsultationPatientImnciVisitDiagnosisListLayout"
                }).state("consultation.management.imncivisit.diagnoses.select", {
                    url: "/select",
                    component: "mrsConsultationPatientImnciVisitDiagnosisSelectLayout"
                }).state("consultation.management.imncivisit.diagnoses.add", {
                    url: "/:diagnosisId/add",
                    component: "mrsConsultationPatientImnciVisitDiagnosisAddLayout"
                }).state("consultation.management.imncivisit.diagnoses.edit", {
                    url: "/:personDiagnosisId/edit",
                    component: "mrsConsultationPatientImnciVisitDiagnosisEditLayout"
                });

        }
    }

    app.config(Config);

}