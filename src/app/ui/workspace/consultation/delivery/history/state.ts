namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.deliveryRegistration", {
                    url: "/delivery/:deliveryId/registration",
                    views: {
                        menu: {
                            component: "mrsConsultationPatientDeliveryRegistrationMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.deliveryRegistration.current", {
                    url: "/current",
                    component: "mrsConsultationPatientDeliveryRegistrationCurrentLayout"
                }).state("consultation.management.deliveryRegistration.medical", {
                    url: "/medical-history",
                    component: "mrsConsultationPatientDeliveryRegistrationMedicalHistoryLayout"
                })





                .state("consultation.management.deliveryRegistration.investigation", {
                    url: "/investigation-history",
                    template: "<div ui-view></div>",
                    abstract: true

                }).state("consultation.management.deliveryRegistration.investigation.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryInvestigationHistoryListLayout"
                })
                .state("consultation.management.deliveryRegistration.investigation.edit", {
                    url: "/:personInvestigationId/:investigationId/edit",
                    component: "mrsConsultationPatientDeliveryInvestigationHistoryEditLayout"
                })
                .state("consultation.management.deliveryRegistration.investigation.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryInvestigationHistoryAddLayout"
                })



                .state("consultation.management.deliveryRegistration.social", {
                    url: "/social-history",
                    component: "mrsConsultationPatientDeliveryRegistrationSocialHistoryLayout"
                }).state("consultation.management.deliveryRegistration.previousPregnancies", {
                    url: "/previous-pregnancies",
                    template: "<div ui-view></div>",
                    abstract: true
                }).state("consultation.management.deliveryRegistration.previousPregnancies.list", {
                    url: "/list",
                    component: "mrsConsultationPatientDeliveryRegistrationPreviousPregnanciesListLayout"
                }).state("consultation.management.deliveryRegistration.previousPregnancies.add", {
                    url: "/add",
                    component: "mrsConsultationPatientDeliveryRegistrationPreviousPregnanciesAddLayout"
                }).state("consultation.management.deliveryRegistration.previousPregnancies.edit", {
                    url: "/:previousAncId/edit",
                    component: "mrsConsultationPatientDeliveryRegistrationPreviousPregnanciesEditLayout"
                }).state("consultation.management.deliveryRegistration.previousPregnancies.editInfant", {
                    url: "/:infantId/editInfant",
                    component: "mrsConsultationPatientDeliveryPreviousPregnanciesEditInfantLayout"
                });

        }
    }

    app.config(Config);

}