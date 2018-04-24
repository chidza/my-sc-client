namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.imnci", {
                    url: "/imnci",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientImnciMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.imnci.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientImnciOverviewLayout"
                })

                // vitals
                .state("consultation.management.imnci.vitals", {
                    url: "/vitals",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.imnci.vitals.list", {
                    url: "/list",
                    component: "mrsConsultationPatientImnciVitalListLayout"
                }).state("consultation.management.imnci.vitals.select", {
                    url: "/select",
                    component: "mrsConsultationPatientImnciVitalSelectLayout"
                }).state("consultation.management.imnci.vitals.add", {
                    url: "/:vitalId/add",
                    component: "mrsConsultationPatientImnciVitalAddLayout"
                }).state("consultation.management.imnci.vitals.edit", {
                    url: "/:personVitalId/edit",
                    component: "mrsConsultationPatientImnciVitalEditLayout"
                })

                // investigations
                .state("consultation.management.imnci.investigations", {
                    url: "/investigations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.imnci.investigations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientImnciInvestigationListLayout"
                }).state("consultation.management.imnci.investigations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientImnciInvestigationSelectLayout"
                }).state("consultation.management.imnci.investigations.add", {
                    url: "/:investigationId/add",
                    component: "mrsConsultationPatientImnciInvestigationAddLayout"
                }).state("consultation.management.imnci.investigations.edit", {
                    url: "/:personInvestigationId/edit",
                    component: "mrsConsultationPatientImnciInvestigationEditLayout"
                })
                .state("consultation.management.imnci.investigations.laboratory", {
                    url: "/:personInvestigationId/laboratory",
                    component: "mrsConsultationPatientImnciInvestigationLaboratoryLayout"
                })

                .state("consultation.management.imnci.investigations.tests", {
                    url: "/:personInvestigationId/tests",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.imnci.investigations.tests.list", {
                    url: "/list",
                    component: "mrsConsultationPatientImnciInvestigationTestListLayout"
                })
                .state("consultation.management.imnci.investigations.tests.add", {
                    url: "/add",
                    component: "mrsConsultationPatientImnciInvestigationTestAddLayout"
                })
                .state("consultation.management.imnci.investigations.tests.edit", {
                    url: "/:personInvestigationTestId/edit",
                    component: "mrsConsultationPatientImnciInvestigationTestEditLayout"
                })

                // medicines
                .state("consultation.management.imnci.medicines", {
                    url: "/medicines",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.imnci.medicines.list", {
                    url: "/list",
                    component: "mrsConsultationPatientImnciMedicineListLayout"
                }).state("consultation.management.imnci.medicines.select", {
                    url: "/select",
                    component: "mrsConsultationPatientImnciMedicineSelectLayout"
                }).state("consultation.management.imnci.medicines.add", {
                    url: "/:medicationId/add",
                    component: "mrsConsultationPatientImnciMedicineAddLayout"
                }).state("consultation.management.imnci.medicines.edit", {
                    url: "/:prescriptionId/edit",
                    component: "mrsConsultationPatientImnciMedicineEditLayout"
                })

                // vaccinations
                .state("consultation.management.imnci.vaccinations", {
                    url: "/vaccinations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.imnci.vaccinations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientImnciVaccinationListLayout"
                }).state("consultation.management.imnci.vaccinations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientImnciVaccinationSelectLayout"
                }).state("consultation.management.imnci.vaccinations.add", {
                    url: "/:drugId/add",
                    component: "mrsConsultationPatientImnciVaccinationAddLayout"
                }).state("consultation.management.imnci.vaccinations.edit", {
                    url: "/:dispenseId/edit",
                    component: "mrsConsultationPatientImnciVaccinationEditLayout"
                }).state("consultation.management.imnci.vaccinations.history", {
                    url: "/:personMedicationId/edit",
                    component: "mrsConsultationPatientImnciVaccinationHistoryLayout"
                });

        }
    }

    app.config(Config);

}