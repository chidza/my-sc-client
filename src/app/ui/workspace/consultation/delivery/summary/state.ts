namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.deliverySummary", {
                    url: "/delivery/:deliveryId/summary",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientDeliverySummaryMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.deliverySummary.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientDeliverySummaryOverviewLayout"
                }).state("consultation.management.deliverySummary.delivery", {
                    url: "/delivery",
                    component: "mrsConsultationPatientDeliverySummaryDeliveryLayout"
                }).state("consultation.management.deliverySummary.membranes", {
                    url: "/membranes",
                    component: "mrsConsultationPatientDeliverySummaryMembranesLayout"
                }).state("consultation.management.deliverySummary.mother", {
                    url: "/mother",
                    component: "mrsConsultationPatientDeliverySummaryMotherLayout"
                }).state("consultation.management.deliverySummary.labour", {
                    url: "/labour",
                    component: "mrsConsultationPatientDeliverySummaryLabourLayout"
                })

                // birth
                .state("consultation.management.deliverySummary.birth", {
                    url: "/birth",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliverySummary.birth.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliverySummaryBirthListLayout"
                }).state("consultation.management.deliverySummary.birth.new", {
                    url: "/new",
                    component: "mrsConsultationPatientDeliverySummaryBirthNewLayout"
                }).state("consultation.management.deliverySummary.birth.edit", {
                    url: "/:infantId/edit",
                    component: "mrsConsultationPatientDeliverySummaryBirthEditLayout"
                }).state("consultation.management.deliverySummary.birth.person", {
                    url: "/:childId/person",
                    component: "mrsConsultationPatientDeliverySummaryBirthPersonLayout"
                })

                // birth resuscitation
                .state("consultation.management.deliverySummary.resuscitation", {
                    url: "/:childId/resuscitation",
                    component: "mrsConsultationPatientDeliverySummaryResuscitationLayout"
                }).state("consultation.management.deliverySummary.resuscitationEdit", {
                    url: "/:childId/:state/resuscitation",
                    component: "mrsConsultationPatientDeliverySummaryResuscitationEditLayout"
                });




        }
    }

    app.config(Config);

}