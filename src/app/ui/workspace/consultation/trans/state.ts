namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                // consult
                .state("consultation.management.changeWards", {
                    url: "/transfer",
                    views: {
                        menu: {
                            component: "mrsConsultationManagementChangeWards"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.changeWards.layout", {
                    url: "/summary",
                    component: "mrsConsultationManagementChangeWardLayout"
                }).state("consultation.management.changeWards.checkList", {
                    url: "/:wardId/wards",
                    component: "mrsConsultationManagementChangeWardCheckList"
                }).state("consultation.management.changeWards.checkListItem", {
                    url: "/:admissionWardCheckListId/:wardCheckListId/wardCheckListItem",
                    component: "mrsConsultationManagementChangeWardCheckListItem"
                });

        }
    }

    app.config(Config);

}