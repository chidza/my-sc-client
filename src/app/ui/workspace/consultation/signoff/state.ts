namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.purpose.signoff.options", {
                    url: "/",
                    template: ""
                })
                .state("consultation.purpose.signoff.admission", {
                    url: "/admission",
                    component: "mrsConsultationPatientSignoffAdmissionLayout"
                })
                .state("consultation.purpose.signoff.discharge", {
                    url: "/discharge",
                    component: "mrsConsultationPatientSignoffDischargeLayout"
                })
                .state("consultation.purpose.signoff.refer", {
                    url: "/refer",
                    component: "mrsConsultationPatientSignoffReferLayout"
                })
                .state("consultation.purpose.signoff.nextqueue", {
                    url: "/next",
                    component: "mrsConsultationPatientSignoffNextQueueLayout"
                });

        }
    }

    app.config(Config);

}