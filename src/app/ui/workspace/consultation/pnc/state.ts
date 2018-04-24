namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.pnc", {
                    url: "/pnc",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientPncMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.pnc.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientPncOverviewLayout"
                }).state("consultation.management.pnc.examinations", {
                    url: "/:pncVisitId/examination",
                    component: "mrsConsultationPatientPncExaminationLayout"
                }).state("consultation.management.pnc.childVisit", {
                    url: "/:childId/child",
                    component: "mrsConsultationPatientPncChildVisitLayout"
                })

                // vitals
                .state("consultation.management.pnc.vitals", {
                    url: "/vitals",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.pnc.vitals.list", {
                    url: "/list",
                    component: "mrsConsultationPatientPncVitalListLayout"
                }).state("consultation.management.pnc.vitals.select", {
                    url: "/select",
                    component: "mrsConsultationPatientPncVitalSelectLayout"
                }).state("consultation.management.pnc.vitals.add", {
                    url: "/:vitalId/add",
                    component: "mrsConsultationPatientPncVitalAddLayout"
                }).state("consultation.management.pnc.vitals.edit", {
                      url: "/:encounterVitalId/edit",
                    component: "mrsConsultationPatientPncVitalEditLayout"
                })

                // medicines
                .state("consultation.management.pnc.medicines", {
                    url: "/medicines",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.pnc.medicines.list", {
                    url: "/list",
                    component: "mrsConsultationPatientPncMedicineListLayout"
                }).state("consultation.management.pnc.medicines.select", {
                    url: "/select",
                    component: "mrsConsultationPatientPncMedicineSelectLayout"
                }).state("consultation.management.pnc.medicines.add", {
                    url: "/:medicationId/add",
                    component: "mrsConsultationPatientPncMedicineAddLayout"
                }).state("consultation.management.pnc.medicines.edit", {
                    url: "/:prescriptionId/edit",
                    component: "mrsConsultationPatientPncMedicineEditLayout"
                })

                 // investigations
                .state("consultation.management.pnc.investigations", {
                    url: "/investigations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.pnc.investigations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientPncInvestigationListLayout"
                }).state("consultation.management.pnc.investigations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientPncInvestigationSelectLayout"
                }).state("consultation.management.pnc.investigations.add", {
                    url: "/:investigationId/add",
                    component: "mrsConsultationPatientPncInvestigationAddLayout"
                }).state("consultation.management.pnc.investigations.edit", {
                    url: "/:personInvestigationId/edit",
                    component: "mrsConsultationPatientPncInvestigationEditLayout"
                })
                .state("consultation.management.pnc.investigations.laboratory", {
                    url: "/:personInvestigationId/laboratory",
                    component: "mrsConsultationPatientPncInvestigationLaboratoryLayout"
                })

                .state("consultation.management.pnc.investigations.tests", {
                    url: "/:personInvestigationId/tests",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.pnc.investigations.tests.list", {
                    url: "/list",
                    component: "mrsConsultationPatientPncInvestigationTestListLayout"
                })
                .state("consultation.management.pnc.investigations.tests.add", {
                    url: "/add",
                    component: "mrsConsultationPatientPncInvestigationTestAddLayout"
                })
                .state("consultation.management.pnc.investigations.tests.edit", {
                    url: "/:personInvestigationTestId/edit",
                    component: "mrsConsultationPatientPncInvestigationTestEditLayout"
                })

                // health education
                .state("consultation.management.pnc.healthEducation", {
                    url: "/education",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.pnc.healthEducation.list", {
                    url: "/list",
                    component: "mrsConsultationPatientPncHealthEducationListLayout"
                }).state("consultation.management.pnc.healthEducation.select", {
                    url: "/select",
                    component: "mrsConsultationPatientPncHealthEducationSelectLayout"
                }).state("consultation.management.pnc.healthEducation.add", {
                   url: "/:educationTopicId/add",
                    component: "mrsConsultationPatientPncHealthEducationAddLayout"
                }).state("consultation.management.pnc.healthEducation.edit", {
                     url: "/:encounterPersonHealthEducationId/edit",
                    component: "mrsConsultationPatientPncHealthEducationEditLayout"
                })

 
                .state("consultation.management.pnc.previousPregnancies", {
                    url: "/previous-pregnancies",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.pnc.previousPregnancies.list", {
                    url: "/list",
                    component: "mrsConsultationPatientPncPreviousPregnanciesListLayout"
                }).state("consultation.management.pnc.previousPregnancies.add", {
                    url: "/add",
                    component: "mrsConsultationPatientPncPreviousPregnanciesAddLayout"
                }).state("consultation.management.pnc.previousPregnancies.edit", {
                    url: "/:previousAncId/edit",
                    component: "mrsConsultationPatientPncPreviousPregnanciesEditLayout"
                }).state("consultation.management.pnc.previousPregnancies.addExisting", {
                    url: "/:deliveryId/add-existing",
                    component: "mrsConsultationPatientPncPreviousPregnanciesAddExistingLayout"
                }).state("consultation.management.pnc.previousPregnancies.editInfant", {
                    url: "/:infantId/editInfant",
                    component: "mrsConsultationPatientPncPreviousPregnanciesEditInfantLayout"
                })

                // procedures
                .state("consultation.management.pnc.procedures", {
                    url: "/procedures",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.pnc.procedures.list", {
                    url: "/list",
                    component: "mrsConsultationPatientPncProcedureListLayout"
                }).state("consultation.management.pnc.procedures.select", {
                    url: "/select",
                    component: "mrsConsultationPatientPncProcedureSelectLayout"
                }).state("consultation.management.pnc.procedures.add", {
                    url: "/:procedureId/add",
                    component: "mrsConsultationPatientPncProcedureAddLayout"
                }).state("consultation.management.pnc.procedures.edit", {
                    url: "/:encounterProcedureId/edit",
                    component: "mrsConsultationPatientPncProcedureEditLayout"
                });

        }
    }

    app.config(Config);

}