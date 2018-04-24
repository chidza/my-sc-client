namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        workspaceId: string;
        artVisitId: string;
        art = {} as data.IArt;
        artId: string;

        static $inject = ["$state", "$stateParams", "dialogs", "ArtVisitService", "$q", "ArtService", "ConsultationService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private dialog: ng.dialogservice.IDialogService,
            private artVisitService: data.IArtVisitService,
            private q: ng.IQService,
            private artService: data.IArtService,
            private consultationService: data.IConsultationService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.workspaceId = params["workspaceId"];
        }

        $onInit = (): void => {
            /*this.getArtSession(this.workareaId, this.personId).then((response) => {
                this.artVisitId = response.id;
            });

            this.artService.getByPersonId(this.personId).then((response) => {
                this.art = response;
            });*/
        }

        onOverview = () => {
            this.state.go("consultation.management.art.overview");
        }
        onRegistration = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.state.go("consultation.management.artRegistration.familyMember.list");
                }
            }, (error) => {
                console.log("error");
            });

        }

        onVitals = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.artEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.art.vitals.list");
                    });

                }
            }, (error) => {
                console.log("error");
            });

        }
        onArtVisit = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.artEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.art.visit.list", { artVisitId: response.artVisitId });
                    });

                }
            }, (error) => {
                console.log("error");
            });

        }

        onNewOi = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.artEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.art.artNewOis.list", { artVisitId: response.artVisitId });
                    });
                }
            });

        }

        onArtStatus = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.artEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.art.artStatuses.list");
                    });
                }
            });

        }

        onIptStatus = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.artEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.art.iptStatus.list");
                    });
                }
            });

        }

        onInvestigation = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.artEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.art.investigations.list");
                    });
                }
            });

        }

        onMedicines = () => {
            this.checkRegistration().then((response) => {
                if (response) {
                    this.consultationService.artEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                        this.state.go("consultation.management.art.medicines.list");
                    });
                }
            });

        }

        onClose = () => {
            this.state.go("consultation.purpose.list", { workareaId: this.workareaId, personId: this.personId });
        }

        checkRegistration = (): ng.IPromise<Boolean> => {
            let defer = this.q.defer();
            this.artService.getByPersonId(this.personId).then((response) => {
                this.art = response;
                this.artId = response.id;
                defer.resolve(true);
            }, (error) => {
                let dlg = this.dialog.confirm("ART Registration", "Patient has no ART record. Do you wish to create one and register patient?");
                dlg.result.then((btn) => {
                    this.art.date = new Date();
                    this.art.artNumber = "";
                    this.art.personId = this.personId;
                    this.artService.save(this.art).then((response) => {
                        this.art = response;
                        this.artId = response.id;
                        this.state.go("consultation.management.artRegistration.familyMember.list");
                    });
                }, () => {
                    defer.resolve(false);
                });
            });
            return defer.promise;

        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientArtMenuLayout", new Component());

}
