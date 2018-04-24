
namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtVisitExaminationDialog extends ng.IController {
        changePersonArtFunctionalStatus: (personArtFunctionalStatusId: Object) => void;
        changePersonArtFollowUpStatus: (personArtFollowUpStatusId: Object) => void;
        screenTb: () => void;
    }

    class Controller implements IArtVisitExaminationDialog {
        public changePersonArtFunctionalStatus: (personArtFunctionalStatusId: Object) => void;
        public changePersonArtFollowUpStatus: (personArtFollowUpStatusId: Object) => void;
        public screenTb: () => void;
        datePickerOpenStatus = {};
        selected: any;
        art: data.IArt;
        artVisit: data.IArtVisit;
        artId: string;
        encounterId: string;
        artVisitId: string;
        personId: string;
        visitTypes: Array<data.IArtVisitType> = [];
        visitStatus: Array<data.IArtVisitStatus> = [];
        whoStages: string[] = ["ONE", "TWO", "THREE", "FOUR"];
        functionalStatus: data.IFunctionalStatus;
        personArtFunctionalStatus: data.IPersonArtFunctionalStatus;
        followUpStatus: data.IFollowUpStatus;
        personArtFollowUpStatus: data.IPersonArtFollowUpStatus;
        whoStage = {} as data.IPersonArtWhoStage;
        tbStatus: data.IPersonTbStatus;
        username: string = "";

        static $inject = ["ArtVisitService", "ArtVisitStatusService", "ArtVisitTypeService", "PersonArtWhoStageService",
            "PersonArtFunctionalStatusService", "FunctionalStatusService", "PersonArtFollowUpStatusService",
            "FollowUpStatusService", "OpdService", "ArtService", "PersonExaminationService", "Principal","$rootScope"];
        constructor(private artVisitService: data.IArtVisitService,
            private artVisitStatusService: data.IArtVisitStatusService,
            private artVisitTypeService: data.IArtVisitTypeService,
            private personArtWhoStageService: data.IPersonArtWhoStageService,
            private personArtFunctionalStatusService: data.IPersonArtFunctionalStatusService,
            private functionalStatusService: data.IFunctionalStatusService,
            private personArtFollowUpStatusService: data.IPersonArtFollowUpStatusService,
            private followUpStatusService: data.IFollowUpStatusService,
            private opdService: data.IOpdService,
            private artService: data.IArtService,
            private personExaminationService: data.IPersonExaminationService,
            private Principal: security.IPrincipal,
             private rootScope: ng.IRootScopeService
        ) {

        }

        $onInit = () => {

            this.artVisitService.get(this.artVisitId).then((response) => {
                this.artVisit = response;
                this.artId = this.artVisit.artId;

                this.artService.get(this.artId).then((response) => {
                    this.personId = response.personId;
                    this.checkTbStatus();
                });
                this.personArtWhoStageService.getCurrent(this.artId).then((response) => {
                    this.whoStage = response;
                });
                this.personArtFollowUpStatusService.getCurrent(this.artId).then((response) => {
                    this.personArtFollowUpStatus = response;
                    console.log("mukati");
                    console.log(this.personArtFollowUpStatus);
                    if (this.personArtFollowUpStatus.id) {
                        this.followUpStatusService.get(this.personArtFollowUpStatus.followUpStatusId).then((response) => {
                            this.followUpStatus = response;
                        });
                    }
                });

                this.personArtFunctionalStatusService.getCurrent(this.artId).then((response) => {
                    this.personArtFunctionalStatus = response;
                    console.log("mukati");
                    console.log(this.personArtFunctionalStatus);

                    if (this.personArtFunctionalStatus.id) {
                        this.functionalStatusService.get(this.personArtFunctionalStatus.functionalStatusId).then((response) => {
                            this.functionalStatus = response;
                        });
                    }
                });
            });

            this.artVisitStatusService.query().then((response) => {
                this.visitStatus = response;
            });
            this.artVisitTypeService.query().then((response) => {
                this.visitTypes = response;
            });
            this.onAuthenticationChanges();

      this.rootScope.$on(security.AUTH_EVENT, this.onAuthenticationChanges);
        }




        isInRole = (roles: Array<string>) => {
            return this.Principal.hasAnyAuthority(roles);
        }

        isAuthenticated = (): boolean => {
            return this.Principal.isAuthenticated() && (this.username.indexOf("Anonymous") === - 1);
        }

        onAuthenticationChanges = () => {

            this.username = "";

            this.Principal.identity().then((response) => {
                if (response !== null) {
                    this.username = response.firstName + " " + response.lastName;
                    console.log("RRRR", this.username);
                }
            });

        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        updateFunctionalStatus = () => {
            console.log("inside the method functional status ");
            console.log(this.personArtFunctionalStatus.id);
            this.changePersonArtFunctionalStatus({ personArtFunctionalStatusId: this.personArtFunctionalStatus.id });
        }
        updateFollowUpStatus = () => {
            console.log("inside the method follow up status");
            console.log(this.personArtFollowUpStatus.id);
            console.log(" this.personArtFollowUpStatus.id....................>. ", this.personArtFollowUpStatus.id );
            this.changePersonArtFollowUpStatus({ personArtFollowUpStatusId: this.personArtFollowUpStatus.id });
        }

        screen = () => {
            this.screenTb();
        }

        checkTbStatus = () => {
            this.opdService.current(this.personId).then((response) => {
                this.personExaminationService.getOpdTbStatus(response.id).then((response) => {
                    this.tbStatus = response;
                    this.tbStatus.status = this.tbStatus.status === "No" ? "Not done" : this.tbStatus.status;
                });
            });
        }


        update = () => {
            this.artVisitService.update(this.artVisit).then((response) => {
                this.artVisit = response;
            });
        }

        updateWhoStage = () => {
            let sd = moment(this.whoStage.date).format("YYYY-MM-DD");
            let cd = moment(new Date).format("YYYY-MM-DD");
            if (this.whoStage.id && (new Date(sd).getTime() === new Date(cd).getTime())) {
                this.personArtWhoStageService.update(this.whoStage).then((response) => {
                    this.whoStage = response;
                });
            } else {
                this.whoStage.date = cd;
                this.whoStage.artId = this.artId;
                this.whoStage.id = null;
                this.personArtWhoStageService.save(this.whoStage).then((response) => {
                    this.whoStage = response;
                });
            }
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-visit-examination/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                changePersonArtFunctionalStatus: "&",
                changePersonArtFollowUpStatus: "&",
                screenTb: "&",
                artVisitId: "<",
                encounterId: "<",
                personId: "<"
            };

        }
    }

    app.component("mrsArtVisitExaminationDialog", new Component());

}
