namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.deliveryMonitoring", {
                    url: "/delivery/:deliveryId/monitoring",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientDeliveryMonitoringMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.deliveryMonitoring.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientDeliveryMonitoringOverviewLayout"
                })

                 //  vitals
                .state("consultation.management.deliveryMonitoring.vitals", {
                    url: "/vitals",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliveryMonitoring.vitals.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryMonitoringVitalListLayout"
                }).state("consultation.management.deliveryMonitoring.vitals.select", {
                    url: "/select",
                    component: "mrsConsultationPatientDeliveryMonitoringVitalSelectLayout"
                }).state("consultation.management.deliveryMonitoring.vitals.add", {
                    url: "/:vitalId/add",
                    component: "mrsConsultationPatientDeliveryMonitoringVitalAddLayout"
                }).state("consultation.management.deliveryMonitoring.vitals.edit", {
                    url: "/:encounterVitalId/edit",
                    component: "mrsConsultationPatientDeliveryMonitoringVitalEditLayout"
                })

                // investigations
                .state("consultation.management.deliveryMonitoring.investigations", {
                    url: "/investigations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliveryMonitoring.investigations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryMonitoringInvestigationListLayout"
                }).state("consultation.management.deliveryMonitoring.investigations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientDeliveryMonitoringInvestigationSelectLayout"
                }).state("consultation.management.deliveryMonitoring.investigations.add", {
                    url: "/:investigationId/add",
                    component: "mrsConsultationPatientDeliveryMonitoringInvestigationAddLayout"
                }).state("consultation.management.deliveryMonitoring.investigations.edit", {
                    url: "/:personInvestigationId/edit",
                    component: "mrsConsultationPatientDeliveryMonitoringInvestigationEditLayout"
                })
                .state("consultation.management.deliveryMonitoring.investigations.laboratory", {
                    url: "/:personInvestigationId/laboratory",
                    component: "mrsConsultationPatientDeliveryMonitoringInvestigationLaboratoryLayout"
                })

                .state("consultation.management.deliveryMonitoring.investigations.tests", {
                    url: "/:personInvestigationId/tests",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.deliveryMonitoring.investigations.tests.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryMonitoringInvestigationTestListLayout"
                })
                .state("consultation.management.deliveryMonitoring.investigations.tests.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryMonitoringInvestigationTestAddLayout"
                })
                .state("consultation.management.deliveryMonitoring.investigations.tests.edit", {
                    url: "/:personInvestigationTestId/edit",
                    component: "mrsConsultationPatientDeliveryMonitoringInvestigationTestEditLayout"
                })

                // medicines
                .state("consultation.management.deliveryMonitoring.medicines", {
                    url: "/medicines",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliveryMonitoring.medicines.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryMonitoringMedicineListLayout"
                }).state("consultation.management.deliveryMonitoring.medicines.select", {
                    url: "/select",
                    component: "mrsConsultationPatientDeliveryMonitoringMedicineSelectLayout"
                }).state("consultation.management.deliveryMonitoring.medicines.add", {
                    url: "/:medicationId/add",
                    component: "mrsConsultationPatientDeliveryMonitoringMedicineAddLayout"
                }).state("consultation.management.deliveryMonitoring.medicines.edit", {
                    url: "/:prescriptionId/edit",
                    component: "mrsConsultationPatientDeliveryMonitoringMedicineEditLayout"
                })

                // cervix
                .state("consultation.management.deliveryMonitoring.cervices", {
                    url: "/cervices",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliveryMonitoring.cervices.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryMonitoringCerviceListLayout"
                }).state("consultation.management.deliveryMonitoring.cervices.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryMonitoringCerviceAddLayout"
                }).state("consultation.management.deliveryMonitoring.cervices.edit", {
                    url: "/:cervixId/edit",
                    component: "mrsConsultationPatientDeliveryMonitoringCerviceEditLayout"
                })

                // vaginal
                .state("consultation.management.deliveryMonitoring.vaginals", {
                    url: "/vaginals",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliveryMonitoring.vaginals.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryMonitoringVaginalListLayout"
                }).state("consultation.management.deliveryMonitoring.vaginals.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryMonitoringVaginalAddLayout"
                }).state("consultation.management.deliveryMonitoring.vaginals.edit", {
                    url: "/:vaginalId/edit",
                    component: "mrsConsultationPatientDeliveryMonitoringVaginalEditLayout"
                })

                // contraction
                .state("consultation.management.deliveryMonitoring.contractions", {
                    url: "/contractions",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliveryMonitoring.contractions.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryMonitoringcontractionListLayout"
                }).state("consultation.management.deliveryMonitoring.contractions.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryMonitoringcontractionAddLayout"
                }).state("consultation.management.deliveryMonitoring.contractions.edit", {
                    url: "/:contractionId/edit",
                    component: "mrsConsultationPatientDeliveryMonitoringcontractionEditLayout"
                })
                ;

        }
    }

    app.config(Config);

}