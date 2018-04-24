namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.art", {
                    url: "/art",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientArtMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.art.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientArtOverviewLayout"
                })

                // art visit

                .state("consultation.management.art.visit", {
                    url: "/:artVisitId/visit",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.art.visit.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtVisitListLayout"
                }).state("consultation.management.art.visit.functionalState", {
                    url: "/functionalState",
                    component: "mrsConsultationPatientArtVisitFunctionalStateLayout"

                }).state("consultation.management.art.visit.followUpStatus", {
                    url: "/followUpStatus",
                    component: "mrsConsultationPatientArtVisitFollowUpStatusLayout"

                })

                // vitals
                .state("consultation.management.art.vitals", {
                    url: "/vitals",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.art.vitals.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtVitalListLayout"
                }).state("consultation.management.art.vitals.select", {
                    url: "/select",
                    component: "mrsConsultationPatientArtVitalSelectLayout"
                }).state("consultation.management.art.vitals.add", {
                    url: "/:vitalId/add",
                    component: "mrsConsultationPatientArtVitalAddLayout"
                }).state("consultation.management.art.vitals.edit", {
                    url: "/:encounterVitalId/edit",
                    component: "mrsConsultationPatientArtVitalEditLayout"
                })

                // ipt status
                .state("consultation.management.art.iptStatus", {
                    url: "/iptStatus",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.art.iptStatus.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtIptStatusListLayout"

                }).state("consultation.management.art.iptStatus.reason", {
                    url: "/:personArtIptStatusId/reason",
                    component: "mrsConsultationPatientArtIptReasonListLayout"
                })

                // art status
                .state("consultation.management.art.artStatuses", {
                    url: "/artStatuses",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.art.artStatuses.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtStatusesList"
                }).state("consultation.management.art.artStatuses.reasons", {
                    url: "/:personArtStatusId/reasons",
                    component: "mrsConsultationPatientArtStatusesReasons"
                }).state("consultation.management.art.artStatuses.regimens", {
                    url: "/:personArtStatusId/regimens",
                    component: "mrsConsultationPatientArtStatusesRegimens"
                })

                // new-oi
                .state("consultation.management.art.artNewOis", {
                    url: "/artNewOis",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.art.artNewOis.list",
                {
                    url: "/:artVisitId/list",
                    component: "mrsConsultationPatientArtNewOiList"
                })
                // investigations
                .state("consultation.management.art.investigations", {
                    url: "/investigations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.art.investigations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtInvestigationListLayout"
                }).state("consultation.management.art.investigations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientArtInvestigationSelectLayout"
                }).state("consultation.management.art.investigations.add", {
                    url: "/:investigationId/add",
                    component: "mrsConsultationPatientArtInvestigationAddLayout"
                }).state("consultation.management.art.investigations.edit", {
                    url: "/:personInvestigationId/edit",
                    component: "mrsConsultationPatientArtInvestigationEditLayout"
                })
                .state("consultation.management.art.investigations.laboratory", {
                    url: "/:personInvestigationId/laboratory",
                    component: "mrsConsultationPatientArtInvestigationLaboratoryLayout"
                })

                .state("consultation.management.art.investigations.tests", {
                    url: "/:personInvestigationId/tests",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.art.investigations.tests.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtInvestigationTestListLayout"
                })
                .state("consultation.management.art.investigations.tests.add", {
                    url: "/add",
                    component: "mrsConsultationPatientArtInvestigationTestAddLayout"
                })
                .state("consultation.management.art.investigations.tests.edit", {
                    url: "/:personInvestigationTestId/edit",
                    component: "mrsConsultationPatientArtInvestigationTestEditLayout"
                })

                // medicines
                .state("consultation.management.art.medicines", {
                    url: "/medicines",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.art.medicines.list", {
                    url: "/list",
                    component: "mrsConsultationPatientArtMedicineListLayout"
                }).state("consultation.management.art.medicines.select", {
                    url: "/select",
                    component: "mrsConsultationPatientArtMedicineSelectLayout"
                }).state("consultation.management.art.medicines.add", {
                    url: "/:medicationId/add",
                    component: "mrsConsultationPatientArtMedicineAddLayout"
                }).state("consultation.management.art.medicines.edit", {
                    url: "/:prescriptionId/edit",
                    component: "mrsConsultationPatientArtMedicineEditLayout"
                });

        }
    }

    app.config(Config);

}