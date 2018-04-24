namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
            stateProvider
                .state("consultation.management.hts", {
                    url: "/hts/:htsId"
                    ,
                    params: {
                        'lastVisited': null //hides lastVisited URL param from the address bar
                    },
                    views: {
                        menu: {
                            component: "mrsConsultationPatientHtsMenuLayout"
                        }
                        ,
                        workspace: {
                            template: "<div ui-view></div>"
                        }
                    },
                    abstract: true

                }).state("consultation.management.hts.overview", {
                    url: "/overview",
                    component: "mrsConsultationPatientHtsOverviewLayout"
                }).state("consultation.management.hts.pretest", {
                    url: "/pretest",
                    component: "mrsConsultationPatientHtsPreTestLayout"
                }).state("consultation.management.hts.posttest", {
                    url: "/posttest",
                    component: "mrsConsultationPatientHtsPostTestLayout",
                    onExit: ["$stateParams", "HtsService", "dialogs", "$q", (params: ng.ui.IStateParamsService, htsService: data.IHtsService, dialog: ng.dialogservice.IDialogService, q: ng.IQService) => {

                        let defer = q.defer();
                        htsService.get(params["htsId"]).then((response: any) => {
                            if (!response.resultsIssued && response.reasonForNotIssuingResultId === null) {
                                let dlg = dialog.error("HTS Error", "Results were not issued but no reason was given. Please verify and try again!");
                                dlg.result.then((btn: any) => {
                                    defer.resolve(false);
                                }, () => {
                                    defer.resolve(false);
                                });

                            } else {
                                defer.resolve(true);
                            }
                        });

                        return defer.promise;
                    }]
                })
                .state("consultation.management.hts.test", {
                    url: "/test",
                    template: "<div ui-view></div>",
                    abstract: true
                })
                .state("consultation.management.hts.test.list", {
                    url: "/",
                    component: "mrsConsultationPatientHtsTestListLayout"
                }).state("consultation.management.hts.test.add", {
                    url: "/:personInvestigationId/add",
                    component: "mrsConsultationPatientHtsTestAddLayout"
                }).state("consultation.management.hts.test.edit", {
                    url: "/:personInvestigationTestId/edit",
                    component: "mrsConsultationPatientHtsTestEditLayout"
                });

        }
    }

    app.config(Config);

}