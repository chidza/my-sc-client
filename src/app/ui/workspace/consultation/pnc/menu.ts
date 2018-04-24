namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        workspaceId: string;
        pncVisitId: string;
        pnc = {} as data.IPnc;
        pncId: string;
        pncVisit = {} as data.IPncVisit;

        static $inject = ["$stateParams", "ConsultationService", "$state", "PncService", "$q", "dialogs", "PncVisitService"];
        constructor(params: ng.ui.IStateParamsService,
            private consulatationService: data.IConsultationService,
            private state: ng.ui.IStateService,
            private pncService: data.IPncService,
            private q: ng.IQService,
            private dialog: ng.dialogservice.IDialogService,
            private pncVisitService: data.IPncVisitService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.workspaceId = params["workspaceId"];
        }

        onExaminations = (): void => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consulatationService.pncEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.pnc.examinations", { pncVisitId: response.pncVisitId });
                    });
                }
            });
        }

        onVitals = (): void => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consulatationService.pncEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        let url = this.state.go("consultation.management.pnc.vitals.list", { pncVisitId: response.pncVisitId });
                         this.checkPncVisitType(response.pncVisitId, url);
                    });
                }
            });
        }

         onInvestigations = (): void => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consulatationService.pncEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.pnc.investigations.list", { pncVisitId: response.pncVisitId });
                    });
                }
            });
        }

        onMedicines = (): void => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consulatationService.pncEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        let url = this.state.go("consultation.management.pnc.medicines.list", { pncVisitId: response.pncVisitId });
                        this.checkPncVisitType(response.pncVisitId, url);
                    });
                }
            });
        }

         onProcedures = (): void => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consulatationService.pncEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.pnc.procedures.list", { pncVisitId: response.pncVisitId });
                    });
                }
            });
        }

        onhealthEducation = (): void => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consulatationService.pncEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        let url = this.state.go("consultation.management.pnc.healthEducation.list", { pncVisitId: response.pncVisitId });
                        this.checkPncVisitType(response.pncVisitId, url);
                    });
                }
            });
        }

        checkPncVisitType = (pncVisitId: string, url: any): void => {

            this.pncVisitService.get(pncVisitId).then((response) => {
                this.pncVisit = response;
                if (this.pncVisit.pncVisitTypeId) {
                    url;
                } else {
                    let defer = this.q.defer();
                    let dlg = this.dialog.notify("PNC Visit", "Please add PNC visit type first");
                    dlg.result.then((btn) => {

                        this.state.go("consultation.management.pnc.examinations", { pncVisitId: pncVisitId });

                    }, () => {
                        defer.resolve(false);
                    });
                }

            });

        }

        checkRegistration = (): ng.IPromise<Boolean> => {
            let defer = this.q.defer();
            this.pncService.current(this.personId).then((response) => {
                this.pnc = response;
                this.pncId = response.id;
                defer.resolve(true);
            }, (error) => {
                let dlg = this.dialog.confirm("Pnc Registration", "Person has no Active Pnc record. Do you wish to create one and register person?");
                dlg.result.then((btn) => {

                    this.state.go("consultation.management.pnc.previousPregnancies.list");

                }, () => {
                    defer.resolve(false);
                });
            });
            return defer.promise;

        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientPncMenuLayout", new Component());

}
