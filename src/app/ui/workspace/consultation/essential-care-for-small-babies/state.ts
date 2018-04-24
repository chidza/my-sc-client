namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.essentialCareForBabies", {
                    url: "/essentialCareForBabies/babies",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientEssentialCareForBabiesMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.essentialCareForBabies.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientEssentialCareForBabiesOverviewLayout"
                }).state("consultation.management.essentialCareForBabies.record", {
                    url: "/:essentialBabyCareId/record",
                    component: "mrsConsultationPatientEssentialCareForBabiesRecordLayout"
                }).state("consultation.management.essentialCareForBabies.manage", {
                    url: "/manage",
                    component: "mrsConsultationPatientEssentialCareForBabiesManageLayout"
                }).state("consultation.management.essentialCareForBabies.view", {
                    url: "/view",
                    component: "mrsConsultationPatientEssentialCareForBabiesViewLayout"

                })
                // state definitions for examinations

                .state("consultation.management.essentialCareForBabies.selectExamination", {
                    url: "/:essentialBabyCareId/select",
                    component: "mrsConsultationPatientEssentialCareForBabiesSelectExaminationLayout"
                })
                .state("consultation.management.essentialCareForBabies.addExamination", {
                    url: "/:essentialBabyCareId/:examinationEcbId/add",
                    component: "mrsConsultationPatientEssentialCareForBabiesAddExaminationLayout"
                })
                .state("consultation.management.essentialCareForBabies.listExamination", {
                    url: "/list",
                    component: "mrsEcbConsultationPatientEssentialCareForBabiesListExaminationLayout"
                })
                .state("consultation.management.essentialCareForBabies.editExamination", {
                    url: "/:essentialBabyCareId/:encounterExaminationId/edit",
                    component: "mrsEcbConsultationPatientEssentialCareForBabiesEditExaminationLayout"
                })

                // state definitions for medicine
                .state("consultation.management.essentialCareForBabies.listMedicine", {
                    url: "/list",
                    component: "mrsEssentialBabiesCarePatientArtMedicineListLayout"
                }).state("consultation.management.essentialCareForBabies.selectMedicine", {
                    url: "/:essentialBabyCareId/select",
                    component: "mrsEssentialBabiesCarePatientArtMedicineSelectLayout"
                }).state("consultation.management.essentialCareForBabies.addMedicine", {
                    url: "/:essentialBabyCareId/:medicationId/add",
                    component: "mrsEssentialBabiesCarePatientArtMedicineAddLayout"
                }).state("consultation.management.essentialCareForBabies.editMedicine", {
                    url: "/:essentialBabyCareId/:prescriptionId/edit",
                    component: "mrsEssentialBabiesCarePatientArtMedicineEditLayout"
                })

                // state definitions for investigations
                .state("consultation.management.essentialCareForBabies.investigationslist", {
                    url: "/list",
                    component: "mrsEssentialBabiesCarePatientInvestigationListLayout"
                }).state("consultation.management.essentialCareForBabies.investigationsselect", {
                    url: "/:essentialBabyCareId/select",
                    component: "mrsEssentialBabiesCarePatientInvestigationSelectLayout"
                }).state("consultation.management.essentialCareForBabies.investigationsadd", {
                    url: "/:essentialBabyCareId/:investigationId/add",
                    component: "mrsEssentialBabiesCarePatientInvestigationAddLayout"
                }).state("consultation.management.essentialCareForBabies.investigationsedit", {
                    url: "/:essentialBabyCareId:personInvestigationId/edit",
                    component: "mrsEssentialBabiesCarePatientInvestigationEditLayout"
                })
                .state("consultation.management.essentialCareForBabies.investigationslaboratory", {
                    url: "/:essentialBabyCareId/:personInvestigationId/laboratory",
                    component: "mrsEssentialBabiesCarePatientInvestigationLaboratoryLayout"
                })
                .state("consultation.management.essentialCareForBabies.investigationstests", {
                    url: "/:essentialBabyCareId/:personInvestigationId/tests",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.essentialCareForBabies.investigationstests.list", {
                    url: "/:essentialBabyCareId/list",
                    component: "mrsEssentialBabiesCarePatientInvestigationTestListLayout"
                })
                .state("consultation.management.essentialCareForBabies.investigationstests.add", {
                    url: "/:essentialBabyCareId/add",
                    component: "mrsEssentialBabiesCarePatientInvestigationTestAddLayout"
                })
                .state("consultation.management.essentialCareForBabies.investigationstests.edit", {
                    url: "/:essentialBabyCareId/:personInvestigationTestId/edit",
                    component: "mrsEssentialBabiesCarePatientInvestigationTestEditLayout"
                })
                // medicine dispense
                .state("consultation.management.essentialCareForBabies.selectMedicinedispense", {
                    url: "/:essentialBabyCareId/select",
                    component: "mrsEssentialBabiesCarePatientConsultMedicineDispenseSelectLayout"
                }).state("consultation.management.essentialCareForBabies.addMedicinedispense", {
                    url: "/:essentialBabyCareId/:medicationId/add",
                    component: "mrsEssentialBabiesCarePatientConsultMedicineDispenseAddLayout"
                }).state("consultation.management.essentialCareForBabies.editMedicinedispense", {
                    url: "/:essentialBabyCareId/:prescriptionId/edit",
                    component: "mrsEssentialBabiesCarePatientConsultMedicineDispenseEditLayout"
                })

                // babies notes
                .state("consultation.management.essentialCareForBabies.babiesNotes", {
                    url: "/babies-notes",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.essentialCareForBabies.babiesNotes.list", {
                    url: "/list",
                    component: "mrsConsultationPatientEssentialCareForBabiesNoteListLayout"
                }).state("consultation.management.essentialCareForBabies.babiesNotes.add", {
                    url: "/add",
                    component: "mrsConsultationPatientEssentialCareForBabiesNoteAddLayout"
                }).state("consultation.management.essentialCareForBabies.babiesNotes.edit", {
                    url: "/:encounterNoteId/edit",
                    component: "mrsConsultationPatientEssentialCareForBabiesNoteEditLayout"
                })
     // vitals
            /*  .state("consultation.management.consult.vitals", {
                url: "/vitals",
                template: "<div ui-view></div>",
                abstract: true 
            })*/.state("consultation.management.essentialCareForBabies.vitalslist", {
                    url: "/list",
                    component: "mrsEssentialBabiesCarePatientConsultVitalListLayout"
                }).state("consultation.management.essentialCareForBabies.vitalsselect", {
                    url: "/:essentialBabyCareId/select",
                    component: "mrsEssentialBabiesCarePatientConsultVitalSelectLayout"
                }).state("consultation.management.essentialCareForBabies.vitalsadd", {
                    url: "/:essentialBabyCareId/:vitalId/add",
                    component: "mrsEssentialBabiesCarePatientConsultVitalAddLayout"
                }).state("consultation.management.essentialCareForBabies.vitalsedit", {
                    url: "/:essentialBabyCareId/:encounterVitalId/edit",
                    component: "mrsEssentialBabiesCarePatientConsultVitalEditLayout"
                });













        }
    }

    app.config(Config);

}