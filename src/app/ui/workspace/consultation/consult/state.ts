namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                // consult
                .state("consultation.management.consult", {
                    url: "/consult",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientConsultMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.consult.summary", {
                    url: "/summary",
                    component: "mrsConsultationPatientConsultSummaryLayout"
                }).state("consultation.management.consult.signoff", {
                    url: "/signoff",
                    component: "mrsConsultationPatientConsultSignOffLayout"
                })

                // vitals
                .state("consultation.management.consult.vitals", {
                    url: "/vitals",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.consult.vitals.list", {
                    url: "/list",
                    component: "mrsConsultationPatientConsultVitalListLayout"
                }).state("consultation.management.consult.vitals.select", {
                    url: "/select",
                    component: "mrsConsultationPatientConsultVitalSelectLayout"
                }).state("consultation.management.consult.vitals.add", {
                    url: "/:vitalId/add",
                    component: "mrsConsultationPatientConsultVitalAddLayout"
                }).state("consultation.management.consult.vitals.edit", {
                    url: "/:encounterVitalId/edit",
                    component: "mrsConsultationPatientConsultVitalEditLayout"
                })

                // complaints
                .state("consultation.management.consult.complaints", {
                    url: "/complaints",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.consult.complaints.list", {
                    url: "/list",
                    component: "mrsConsultationPatientConsultComplaintListLayout"
                }).state("consultation.management.consult.complaints.select", {
                    url: "/select",
                    component: "mrsConsultationPatientConsultComplaintSelectLayout"
                }).state("consultation.management.consult.complaints.add", {
                    url: "/:complaintId/add",
                    component: "mrsConsultationPatientConsultComplaintAddLayout"
                }).state("consultation.management.consult.complaints.edit", {
                    url: "/:encounterComplaintId/edit",
                    component: "mrsConsultationPatientConsultComplaintEditLayout"
                })

                // examinations
                .state("consultation.management.consult.examinations", {
                    url: "/examinations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.consult.examinations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientConsultExaminationListLayout"
                }).state("consultation.management.consult.examinations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientConsultExaminationSelectLayout"
                }).state("consultation.management.consult.examinations.add", {
                    url: "/:examinationId/add",
                    component: "mrsConsultationPatientConsultExaminationAddLayout"
                }).state("consultation.management.consult.examinations.edit", {
                    url: "/:encounterExaminationId/edit",
                    component: "mrsConsultationPatientConsultExaminationEditLayout"
                })

                // investigations
                .state("consultation.management.consult.investigations", {
                    url: "/investigations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.consult.investigations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientConsultInvestigationListLayout"
                }).state("consultation.management.consult.investigations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientConsultInvestigationSelectLayout"
                }).state("consultation.management.consult.investigations.add", {
                    url: "/:investigationId/add",
                    component: "mrsConsultationPatientConsultInvestigationAddLayout"
                }).state("consultation.management.consult.investigations.edit", {
                    url: "/:personInvestigationId/edit",
                    component: "mrsConsultationPatientConsultInvestigationEditLayout"
                })
                .state("consultation.management.consult.investigations.laboratory", {
                    url: "/:personInvestigationId/laboratory",
                    component: "mrsConsultationPatientConsultInvestigationLaboratoryLayout"
                })

                .state("consultation.management.consult.investigations.tests", {
                    url: "/:personInvestigationId/tests",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.consult.investigations.tests.list", {
                    url: "/list",
                    component: "mrsConsultationPatientConsultInvestigationTestListLayout"
                })
                .state("consultation.management.consult.investigations.tests.add", {
                    url: "/add",
                    component: "mrsConsultationPatientConsultInvestigationTestAddLayout"
                })
                .state("consultation.management.consult.investigations.tests.edit", {
                    url: "/:personInvestigationTestId/edit",
                    component: "mrsConsultationPatientConsultInvestigationTestEditLayout"
                })

                // diagnoses
                .state("consultation.management.consult.diagnoses", {
                    url: "/diagnoses",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.consult.diagnoses.list", {
                    url: "/list",
                    component: "mrsConsultationPatientConsultDiagnosisListLayout"
                }).state("consultation.management.consult.diagnoses.select", {
                    url: "/select",
                    component: "mrsConsultationPatientConsultDiagnosisSelectLayout"
                }).state("consultation.management.consult.diagnoses.add", {
                    url: "/:diagnosisId/add",
                    component: "mrsConsultationPatientConsultDiagnosisAddLayout"
                }).state("consultation.management.consult.diagnoses.edit", {
                    url: "/:encounterDiagnosisId/edit",
                    component: "mrsConsultationPatientConsultDiagnosisEditLayout"
                })

                // medicines
                .state("consultation.management.consult.medicines", {
                    url: "/medicines",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.consult.medicines.list-prescribe", {
                    url: "/list-prescribe",
                    component: "mrsConsultationPatientConsultMedicineListPrescribeLayout"
                }).state("consultation.management.consult.medicines.list-dispense", {
                    url: "/list-dispense",
                    component: "mrsConsultationPatientConsultMedicineListDispenseLayout"
                }).state("consultation.management.consult.medicines.select", {
                    url: "/select",
                    component: "mrsConsultationPatientConsultMedicineSelectLayout"
                })


                .state("consultation.management.consult.medicines.select-dispense", {
                    url: "/select-dispense",
                    component: "mrsConsultationPatientConsultMedicineDispenseSelectLayout"
                }).state("consultation.management.consult.medicines.add-dispense", {
                    url: "/:medicationId/add-dispense",
                    component: "mrsConsultationPatientConsultMedicineDispenseAddLayout"
                }).state("consultation.management.consult.medicines.edit-dispense", {
                    url: "/:encounterMedicationId/edit-dispense",
                    component: "mrsConsultationPatientConsultMedicineDispenseEditLayout"
                })


                .state("consultation.management.consult.medicines.add", {
                    url: "/:medicationId/add",
                    component: "mrsConsultationPatientConsultMedicineAddLayout"
                }).state("consultation.management.consult.medicines.edit", {
                    url: "/:prescriptionId/edit",
                    component: "mrsConsultationPatientConsultMedicineEditLayout"
                })

                // procedures
                .state("consultation.management.consult.procedures", {
                    url: "/procedures",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.consult.procedures.list", {
                    url: "/list",
                    component: "mrsConsultationPatientConsultProcedureListLayout"
                }).state("consultation.management.consult.procedures.select", {
                    url: "/select",
                    component: "mrsConsultationPatientConsultProcedureSelectLayout"
                }).state("consultation.management.consult.procedures.add", {
                    url: "/:procedureId/add",
                    component: "mrsConsultationPatientConsultProcedureAddLayout"
                }).state("consultation.management.consult.procedures.edit", {
                    url: "/:encounterProcedureId/edit",
                    component: "mrsConsultationPatientConsultProcedureEditLayout"
                })


                ;

        }
    }

    app.config(Config);

}