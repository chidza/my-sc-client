namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.anc", {
                    url: "/anc",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientAncMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.anc.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientAncOverviewLayout"
                })
                // Anc Registration
                .state("consultation.management.ancregistration", {
                    url: "/registration",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientAncRegistrationMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true
                }).state("consultation.management.ancregistration.enrollment", {
                    url: "/enrollment",
                    component: "mrsConsultationPatientAncEnrollmentLayout"
                }).state("consultation.management.ancregistration.ancEdit", {
                    url: "/edit",
                    component: "mrsConsultationPatientAncEdit"
                }).state("consultation.management.ancregistration.socialhistory", {
                    url: "/:ancId/socialhistory",
                    component: "mrsConsultationPatientSocialhistoryLayout"
                }).state("consultation.management.ancregistration.medicalHistory", {
                    url: "/:ancId/medicalHistory",
                    component: "mrsConsultationPatientAncMedicalHistoryLayout"
                }).state("consultation.management.ancregistration.previousPregnancy", {
                    url: "/:ancId/previousPregnancy",
                    component: "mrsConsultationPatientAncPreviousPregnancyLayout"
                }).state("consultation.management.ancregistration.visitHistory", {
                    url: "/visitHistory",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.ancregistration.visitHistory.list", {
                    url: "/:ancId/list",
                    component: "mrsConsultationPatientAncVisitHistoryListLayout"
                }).state("consultation.management.ancregistration.visitHistory.add", {
                    url: "/:ancId/add",
                    component: "mrsConsultationPatientAncVisitHistoryAddLayout"
                }).state("consultation.management.ancregistration.visitHistory.edit", {
                    url: "/:ancId/:visitId/edit",
                    component: "mrsConsultationPatientAncVisitHistoryEditLayout"
                })
                .state("consultation.management.ancregistration.previousPregnancies", {
                    url: "/previous-pregnancies",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.ancregistration.previousPregnancies.list", {
                    url: "/list",
                    component: "mrsConsultationPatientAncPreviousPregnanciesListLayout"
                }).state("consultation.management.ancregistration.previousPregnancies.add", {
                    url: "/add",
                    component: "mrsConsultationPatientAncPreviousPregnanciesAddLayout"
                }).state("consultation.management.ancregistration.previousPregnancies.editInfant", {
                    url: "/:infantId/editInfant",
                    component: "mrsConsultationPatientAncPreviousPregnanciesEditInfantLayout"
                }).state("consultation.management.ancregistration.previousPregnancies.edit", {
                    url: "/:previousAncId/edit",
                    component: "mrsConsultationPatientAncPreviousPregnanciesEditLayout"
                })

                 //ancRegistration investigation history
                .state("consultation.management.ancregistration.investigationHistory", {
                    url: "/investigation-history",
                    template: "<div ui-view></div>",
                    abstract: true

                }).state("consultation.management.ancregistration.investigationHistory.list", {
                    url: "/list",
                    component: "mrsConsultationAncDeliveryInvestigationHistoryListLayout"
                })
                .state("consultation.management.ancregistration.investigationHistory.edit", {
                    url: "/:personInvestigationId/:investigationId/edit",
                    component: "mrsConsultationAncDeliveryInvestigationHistoryEditLayout"
                })
                .state("consultation.management.ancregistration.investigationHistory.add", {
                    url: "/add",
                    component: "mrsConsultationAncDeliveryInvestigationHistoryAddLayout"
                })
                // vitals
                .state("consultation.management.anc.vitals", {
                    url: "/vitals",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.anc.vitals.list", {
                    url: "/list",
                    component: "mrsConsultationPatientAncVitalListLayout"
                }).state("consultation.management.anc.vitals.select", {
                    url: "/select",
                    component: "mrsConsultationPatientAncVitalSelectLayout"
                }).state("consultation.management.anc.vitals.add", {
                    url: "/:vitalId/add",
                    component: "mrsConsultationPatientAncVitalAddLayout"
                }).state("consultation.management.anc.vitals.edit", {
                    url: "/:encounterVitalId/edit",
                    component: "mrsConsultationPatientAncVitalEditLayout"
                })

                        // General Assessment
                .state("consultation.management.anc.generalAssessment", {
                    url: "/generalAssessment",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.anc.generalAssessment.list", {
                    url: "/list",
                    component: "mrsConsultationPatientAncGeneralAssessmentListLayout"
                })

                // Obstrectic Examination
                .state("consultation.management.anc.obstrecticExamination", {
                    url: "/obstrecticExamination",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.anc.obstrecticExamination.list", {
                    url: "/list",
                    component: "mrsConsultationPatientAncObstrecticExaminationListLayout"
                })

                // investigations
                .state("consultation.management.anc.investigations", {
                    url: "/investigations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.anc.investigations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientAncInvestigationListLayout"
                }).state("consultation.management.anc.investigations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientAncInvestigationSelectLayout"
                }).state("consultation.management.anc.investigations.add", {
                    url: "/:investigationId/add",
                    component: "mrsConsultationPatientAncInvestigationAddLayout"
                }).state("consultation.management.anc.investigations.edit", {
                    url: "/:personInvestigationId/edit",
                    component: "mrsConsultationPatientAncInvestigationEditLayout"
                })
                .state("consultation.management.anc.investigations.laboratory", {
                    url: "/:personInvestigationId/laboratory",
                    component: "mrsConsultationPatientAncInvestigationLaboratoryLayout"
                })

                .state("consultation.management.anc.investigations.tests", {
                    url: "/:personInvestigationId/tests",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.anc.investigations.tests.list", {
                    url: "/list",
                    component: "mrsConsultationPatientAncInvestigationTestListLayout"
                })
                .state("consultation.management.anc.investigations.tests.add", {
                    url: "/add",
                    component: "mrsConsultationPatientAncInvestigationTestAddLayout"
                })
                .state("consultation.management.anc.investigations.tests.edit", {
                    url: "/:personInvestigationTestId/edit",
                    component: "mrsConsultationPatientAncInvestigationTestEditLayout"
                })

                // medicines
                .state("consultation.management.anc.medicines", {
                    url: "/medicines",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.anc.medicines.list", {
                    url: "/list",
                    component: "mrsConsultationPatientAncMedicineListLayout"
                }).state("consultation.management.anc.medicines.select", {
                    url: "/select",
                    component: "mrsConsultationPatientAncMedicineSelectLayout"
                }).state("consultation.management.anc.medicines.add", {
                    url: "/:medicationId/add",
                    component: "mrsConsultationPatientAncMedicineAddLayout"
                }).state("consultation.management.anc.medicines.edit", {
                    url: "/:prescriptionId/edit",
                    component: "mrsConsultationPatientAncMedicineEditLayout"
                })
                // health educations
                .state("consultation.management.anc.education", {
                    url: "/education",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.anc.education.list", {
                    url: "/list",
                    component: "mrsConsultationPatientAncEducationListLayout"
                }).state("consultation.management.anc.education.select", {
                    url: "/select",
                    component: "mrsConsultationPatientAncEducationSelectLayout"
                }).state("consultation.management.anc.education.add", {
                    url: "/:educationTopicId/add",
                    component: "mrsConsultationPatientAncEducationAddLayout"
                }).state("consultation.management.anc.education.edit", {
                    url: "/:encounterPersonHealthEducationId/edit",
                    component: "mrsConsultationPatientAncEducationEditLayout"
                });

        }
    }

    app.config(Config);

}