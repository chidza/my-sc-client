namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                // Registration
                .state("consultation.management.artRegistration", {
                    url: "/register",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientArtRegistrationMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true
                })
                // set hiv
                .state("consultation.management.artRegistration.setHiv", {
                    url: "/:personInvestigationId/:investigationId/set-hiv",
                    component: "mrsConsultationPatientArtSetHiv"
                })
                // family members
                .state("consultation.management.artRegistration.familyMember", {
                    url: "/family-member",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.artRegistration.familyMember.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtFamilyMemberListLayout"
                })
                .state("consultation.management.artRegistration.familyMember.select", {
                    url: "/select",
                    component: "mrsConsultationPatientArtFamilyMemberSelectLayout"
                })
                .state("consultation.management.artRegistration.familyMember.add", {
                    url: "/:memberId/add",
                    component: "mrsConsultationPatientArtFamilyMemberAddLayout"
                })



                // registration-examinations
                .state("consultation.management.artRegistration.examinations", {
                    url: "/examinations",
                    component: "mrsConsultationPatientArtExaminations"
                })
                // registration-current-symptoms
                .state("consultation.management.artRegistration.currentSymptoms", {
                    url: "/currentSymptoms",
                    component: "mrsConsultationPatientArtCurrentSymptoms"
                })

                // art initiation
                .state("consultation.management.artRegistration.artInitiations", {
                    url: "/artInitiations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.artRegistration.artInitiations.artInitiation", {
                    url: "/art-initiation",
                    component: "mrsConsultationPatientArtInitiation"
                }).state("consultation.management.artRegistration.artInitiations.artInitiationRegimen", {
                    url: "/:personArtStatusId/regimen",
                    component: "mrsConsultationPatientArtInitiationRegimen"
                }).state("consultation.management.artRegistration.artInitiations.artInitiationReason", {
                    url: "/:personArtStatusId/reasons",
                    component: "mrsConsultationPatientArtInitiationReason"
                })

                // registration-medical-history
                .state("consultation.management.artRegistration.medicalHistory", {
                    url: "/medicalHistory",
                    component: "mrsConsultationPatientArtMedicalHistory"
                })

                // registration-drug-history
                .state("consultation.management.artRegistration.drugHistory", {
                    url: "/drugHistory",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.artRegistration.drugHistory.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtDrugHistoryListLayout"
                })
                .state("consultation.management.artRegistration.drugHistory.select", {
                    url: "/select",
                    component: "mrsConsultationPatientArtDrugHistorySelectLayout"
                })
                .state("consultation.management.artRegistration.drugHistory.add", {
                    url: "/:drugNameId/add",
                    component: "mrsConsultationPatientArtDrugHistoryAddLayout"
                })
                .state("consultation.management.artRegistration.drugHistory.edit", {
                    url: "/:personMedicationId/edit",
                    component: "mrsConsultationPatientArtDrugHistoryEditLayout"
                })

                // registration-investigation-history
                .state("consultation.management.artRegistration.investigationHistory", {
                    url: "/investigationHistory",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.artRegistration.investigationHistory.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtInvestigationHistoryListLayout"
                })
                .state("consultation.management.artRegistration.investigationHistory.edit", {
                    url: "/:personInvestigationId/:investigationId/edit",
                    component: "mrsConsultationPatientArtInvestigationHistoryEditLayout"
                })
                .state("consultation.management.artRegistration.investigationHistory.add", {
                    url: "/add",
                    component: "mrsConsultationPatientArtInvestigationHistoryAddLayout"
                })

                ;

        }
    }

    app.config(Config);

}