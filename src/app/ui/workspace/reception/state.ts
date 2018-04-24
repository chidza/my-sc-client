namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("reception", {
                    url: "/reception",
                    templateUrl: "app/ui/workspace/reception/reception.html",
                    abstract: true
                })
                .state("reception.list", {
                    url: "/search",
                    component: "mrsReceptionSearch"
                })
                .state("reception.new", {
                    url: "/registration",
                    component: "mrsReceptionRegistration"
                })
                .state("reception.management", {
                    url: "/management/:personId",
                    component: "mrsReceptionFileManagement",
                    abstract: true
                })
                // overview
                .state("reception.management.overview", {
                    url: "/overview",
                    component: "mrsReceptionFileManagementOverview"
                })
                // demographics
                .state("reception.management.demographics", {
                    url: "/demographics",
                    component: "mrsReceptionFileManagementDemographics"
                })
                .state("reception.management.demographics-edit", {
                    url: "/demographics/edit",
                    component: "mrsReceptionFileManagementDemographicsEdit"
                })
                // identification
                .state("reception.management.identification", {
                    url: "/identification",
                    component: "mrsReceptionFileManagementIdentification"
                })
                .state("reception.management.identification-add", {
                    url: "/identification/add",
                    component: "mrsReceptionFileManagementIdentificationAdd"
                })
                .state("reception.management.identification-edit", {
                    url: "/identification/:id",
                    component: "mrsReceptionFileManagementIdentificationEdit"
                })
                // contactdetail
                .state("reception.management.contactdetail", {
                    url: "/contact-detail",
                    component: "mrsReceptionFileManagementContactDetail"
                })
                .state("reception.management.contactdetail-address-add", {
                    url: "/contact-detail/addresses",
                    component: "mrsReceptionFileManagementContactDetailAddressAdd"
                })
                .state("reception.management.contactdetail-address-edit", {
                    url: "/contact-detail/addresses/:addressId",
                    component: "mrsReceptionFileManagementContactDetailAddressEdit"
                })
                .state("reception.management.contactdetail-phone-add", {
                    url: "/contact-detail/phones",
                    component: "mrsReceptionFileManagementContactDetailPhoneAdd"
                })
                .state("reception.management.contactdetail-phone-edit", {
                    url: "/contact-detail/phones/:phoneId",
                    component: "mrsReceptionFileManagementContactDetailPhoneEdit"
                })
                .state("reception.management.contactdetail-email-add", {
                    url: "/contact-detail/emails",
                    component: "mrsReceptionFileManagementContactDetailEmailAdd"
                })
                .state("reception.management.contactdetail-email-edit", {
                    url: "/contact-detail/emails/:emailId",
                    component: "mrsReceptionFileManagementContactDetailEmailEdit"
                })
                // relation
                .state("reception.management.relation", {
                    url: "/relations",
                    component: "mrsReceptionFileManagementRelation"
                })
                .state("reception.management.relation-select", {
                    url: "/relations/select",
                    component: "mrsReceptionFileManagementRelationSelect"
                })
                .state("reception.management.relation-add", {
                    url: "/relations/:id/add",
                    component: "mrsReceptionFileManagementRelationAdd"
                })
                .state("reception.management.relation-edit", {
                    url: "/relations/:id/edit",
                    component: "mrsReceptionFileManagementRelationEdit"
                })
                // medicalaid
                .state("reception.management.medicalaid", {
                    url: "/medicalaid",
                    component: "mrsReceptionFileManagementMedicalAid"
                })
                .state("reception.management.medicalaid-add", {
                    url: "/medicalaid/add",
                    component: "mrsReceptionFileManagementMedicalAidAdd"
                })
                .state("reception.management.medicalaid-edit", {
                    url: "/medicalaid/:id",
                    component: "mrsReceptionFileManagementMedicalAidEdit"
                })
                // opd init
                .state("reception.management.opd", {
                    url: "/out-patient",
                    component: "mrsReceptionOpdInit"
                })
                // admission
                .state("reception.management.admission", {
                    url: "/admission",
                    component: "mrsReceptionAdmission"
                })
                // account
                .state("reception.management.account", {
                    url: "/account",
                    component: "mrsReceptionAccount"
                });
        }
    }

    app.config(Config);

}