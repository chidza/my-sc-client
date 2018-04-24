namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.tb", {
                    url: "/tb",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientTbMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.tb.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientTbOverviewLayout"
                }).state("consultation.management.tb.registration", {
                    url: "/registration",
                    component: "mrsConsultationPatientTbRegistrationLayout"
                }).state("consultation.management.tb.outcome", {
                    url: "/outcome",
                    component: "mrsConsultationPatientTbOutcomeLayout"
                })

                // vitals
                .state("consultation.management.tb.vitals", {
                    url: "/vitals",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.tb.vitals.list", {
                    url: "/list",
                    component: "mrsConsultationPatientTbVitalListLayout"
                }).state("consultation.management.tb.vitals.select", {
                    url: "/select",
                    component: "mrsConsultationPatientTbVitalSelectLayout"
                }).state("consultation.management.tb.vitals.add", {
                    url: "/:vitalId/add",
                    component: "mrsConsultationPatientTbVitalAddLayout"
                }).state("consultation.management.tb.vitals.edit", {
                    url: "/:encounterVitalId/edit",
                    component: "mrsConsultationPatientTbVitalEditLayout"
                })

                // examinations
                .state("consultation.management.tb.examinations", {
                    url: "/examinations",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.tb.examinations.list", {
                    url: "/list",
                    component: "mrsConsultationPatientTbExaminationListLayout"
                }).state("consultation.management.tb.examinations.select", {
                    url: "/select",
                    component: "mrsConsultationPatientTbExaminationSelectLayout"
                }).state("consultation.management.tb.examinations.add", {
                    url: "/:examinationId/add",
                    component: "mrsConsultationPatientTbExaminationAddLayout"
                }).state("consultation.management.tb.examinations.edit", {
                    url: "/:encounterExaminationId/edit",
                    component: "mrsConsultationPatientTbExaminationEditLayout"
                })

                // medicines
                .state("consultation.management.tb.medicines", {
                    url: "/medicines",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.tb.medicines.list", {
                    url: "/list",
                    component: "mrsConsultationPatientTbMedicineListLayout"
                }).state("consultation.management.tb.medicines.select", {
                    url: "/select",
                    component: "mrsConsultationPatientTbMedicineSelectLayout"
                }).state("consultation.management.tb.medicines.add", {
                    url: "/:medicationId/add",
                    component: "mrsConsultationPatientTbMedicineAddLayout"
                }).state("consultation.management.tb.medicines.edit", {
                    url: "/:prescriptionId/edit",
                    component: "mrsConsultationPatientTbMedicineEditLayout"
                })

                 // health educations
                .state("consultation.management.tb.education", {
                    url: "/education",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.tb.education.list", {
                    url: "/list",
                    component: "mrsConsultationPatientTbEducationListLayout"
                }).state("consultation.management.tb.education.select", {
                    url: "/select",
                    component: "mrsConsultationPatientTbEducationSelectLayout"
                }).state("consultation.management.tb.education.add", {
                    url: "/:educationTopicId/add",
                    component: "mrsConsultationPatientTbEducationAddLayout"
                }).state("consultation.management.tb.education.edit", {
                    url: "/:encounterPersonHealthEducationId/edit",
                    component: "mrsConsultationPatientTbEducationEditLayout"
                })
                ;

        }
    }

    app.config(Config);

}