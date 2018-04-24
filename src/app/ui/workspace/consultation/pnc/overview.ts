namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPncPatientOverview extends ng.IController {

    }

    class Controller implements IPncPatientOverview {

        pncVisitId: string;
        personId: string;
        pncId: string;
        workareaId: string;
        encounterId: string;
        opdId: string;
        queueId: string;
        pnc: data.IPnc;
        hivStatus: string;
        date: Date;
        workspaceId: string;
        childPnc = {} as data.IPnc;
        pncVisit: data.IPncVisit;
        pncvisittypes: Array<data.IPncVisitType> = [];
        children: Array<data.IPerson> = [];
        ScreeningList: Array<{}> = [{ id: 1, name: "Breast Cancer Screened" }, { id: 2, name: "Cervical Cancer Screened" }, { id: 3, name: "Syphillis Screened" }, { id: 4, name: "TB Screened" }];

        static $inject = ["$state", "$stateParams", "PncService", "PncVisitService", "PncVisitTypeService",
            "PncChildService", "PersonService", "OpdService", "dialogs", "ConsultationService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private pncService: data.IPncService,
            private pncVisitService: data.IPncVisitService,
            private pncVisitTypeService: data.IPncVisitTypeService,
            private pncChildService: data.IPncChildService,
            private personService: data.IPersonService,
            private opdService: data.IOpdService,
            private dialog: ng.dialogservice.IDialogService,
            private consultationService: data.IConsultationService) {
            this.personId = params["personId"];
            this.workareaId = params["workareaId"];
            this.workspaceId = params["workspaceId"];
            this.encounterId = params["encounterId"];

        }



        $onInit = () => {
            this.pncVisitTypeService.query().then((response) => {
                this.pncvisittypes = response;
            });

            this.pncService.current(this.personId).then((response) => {
                this.pnc = response;
                this.pncId = this.pnc.id;
                this.consultationService.pncEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                    this.pncVisitId = response.pncVisitId;
                });

                this.pncChildService.getByPncId(this.pncId).then((response) => {
                    this.children = response;
                });
            });

            this.date = new Date();

        }

        childAge = (dob: Date): number => {
            let current = moment(new Date);
            let date = moment(dob);
            return current.diff(date, "days");
        }

        attend = (id: string) => {
            this.pncVisitService.get(this.pncVisitId).then((response) => {
                    this.pncService.current(id).then((response) => {
                        this.state.go("consultation.management.pnc.childVisit", { childId: id });
                    }, (err) => {
                        this.childPnc.date = this.pnc.date;
                        this.childPnc.personId = id;
                        this.pncService.save(this.childPnc).then((pnc) => {
                            this.state.go("consultation.management.pnc.childVisit", { childId: id });
                        });

                    });
            });

        }

        onOfferHts = () => {
            let state = "consultation.management.hts.overview";
            let dlg = this.dialog.confirm("HTS Module", "Do you want to proceed to HTS Module?");
            dlg.result.then((btn) => {
                this.consultationService.htsEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                    this.state.go(state, {
                        workareaId: this.workareaId, personId: this.personId,
                        encounterId: response.encounterId, htsId: response.htsId, lastVisited: "none"
                    });
                });
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/overview.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }
    }



    app.component("mrsConsultationPatientPncOverviewLayout", new Component());

}
