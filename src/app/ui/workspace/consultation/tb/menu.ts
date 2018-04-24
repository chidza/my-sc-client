namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        workspaceId: string;
        tbVisitId: string;
        tb = {} as data.ITb;
        tbId: string;

        static $inject = ["$state", "$stateParams", "dialogs", "TbVisitService", "$q", "TbService", "ConsultationService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private dialog: ng.dialogservice.IDialogService,
            private tbVisitService: data.ITbVisitService,
            private q: ng.IQService,
            private tbService: data.ITbService,
            private consultationService: data.IConsultationService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.workspaceId = params["workspaceId"];
        }

        onOverview = () => {
            this.state.go("consultation.management.tb.overview");
        }
        onRegistration = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.state.go("consultation.management.tb.registration");
                }
            }, (error) => {
                console.log("error");
            });

        }

        onVitals = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.tbEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.tb.vitals.list");
                    });

                }
            }, (error) => {
                console.log("error");
            });

        }
        onExamination = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.tbEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.tb.examinations.list", { tbVisitId: response.tbVisitId });
                    });

                }
            }, (error) => {
                console.log("error");
            });

        }

        onTreatment = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.tbEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.tb.medicines.list", { tbVisitId: response.tbVisitId });
                    });
                }
            });

        }

        onHealthEducation = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.tbEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.tb.education.list");
                    });
                }
            });

        }

        onTbOutcome = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.tbEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.tb.outcome");
                    });
                }
            });

        }



        onClose = () => {
            this.state.go("consultation.purpose.list", { workareaId: this.workareaId, personId: this.personId });
        }

        checkRegistration = (): ng.IPromise<Boolean> => {
            let defer = this.q.defer();
            this.tbService.current(this.personId).then((response) => {
                console.log("response in menu");
                console.log(response.id);
                this.tb = response;
                this.tbId = response.id;
                defer.resolve(true);
            }, (error) => {
                let dlg = this.dialog.confirm("TB Registration", "Patient has no TB record. Do you wish to create one and register patient?");
                dlg.result.then((btn) => {
                    this.state.go("consultation.management.tb.registration");

                }, () => {
                    defer.resolve(false);
                });
            });
            return defer.promise;

        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/tb/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientTbMenuLayout", new Component());

}
