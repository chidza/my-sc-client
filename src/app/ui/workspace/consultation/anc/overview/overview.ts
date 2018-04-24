namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        workspaceId: string;
        anc: data.IAnc;
        ancId: string;
        ancVisit: data.IAncVisit;
        ancInformation: data.IInformation;
        ancHistoryList: Array<data.IAncHistory> = [];
        socialHistories: Array<data.IAncQuestionaire> = [];
        socialHistory = {} as data.IAncQuestionaire;


        static $inject = ["$state", "$stateParams", "dialogs", "AncModuleService", "AncHistoryService",
            "AncQuestionaireService", "AncService", "AncVisitService", "ConsultationService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private dialog: ng.dialogservice.IDialogService,
            private ancModuleService: data.IAncModuleService,
            private ancHistoryService: data.IAncHistoryService,
            private ancQuestionaireService: data.IAncQuestionaireService,
            private ancService: data.IAncService,
            private ancVisitService: data.IAncVisitService,
            private consultationService: data.IConsultationService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.workspaceId = params["workspaceId"];
        }
        $onInit = (): void => {

            this.ancModuleService.getCurrentAnc(this.personId).then((response) => {
                this.anc = response;
                this.ancId = this.anc.id;
                if (this.personId && this.workareaId) {
                    this.ancModuleService.getAncSession(this.workareaId, this.personId).then((response) => {
                        this.ancVisit = response;
                    });
                }

                this.ancHistoryService.getByAncId(this.ancId).then((response) => {
                    this.ancHistoryList = response;
                    this.ancHistoryList.forEach((history) => {
                        this.ancQuestionaireService.get(history.ancQuestionareId).then((response) => {
                            this.socialHistory = response;
                            this.socialHistories.push(this.socialHistory);
                        }, (error) => {

                        });
                    });
                }, (error) => {

                });
            }, (error) => {

            });
            this.ancService.getInformation(this.personId).then((response) => {
                this.ancInformation = response;
            });
        }

        updateVisitNumber = (visitNumber: any): void => {
            if (visitNumber > 0) {
                this.ancVisit.visitNumber = visitNumber;
                this.ancVisitService.update(this.ancVisit).then((response) => {
                });
            } else {
                let dlg = this.dialog.error("AncVisit", "Can not update visitNumber with null value");
            }

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

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/overview/overview.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientAncOverviewLayout", new Component());

}
