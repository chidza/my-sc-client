namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
    }

    class Controller implements ng.IController {

        personId: string;
        admission: data.IAdmission = null;
        encounterId: string = "";
        wardId: string;
        workareaId: string;
        wardCheckListTopics: Array<data.IWardCheckList> = [];
        static $inject = ["AdmissionService", "$state", "$stateParams", "WardCheckListService", "dialogs"];
        constructor(private admissionService: data.IAdmissionService,
            private state: ng.ui.IStateService,
            params: IParams,
            private wardCheckListService: data.IWardCheckListService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params.personId;
            this.workareaId = params["workareaId"];
        }

        $onInit = (): void => {

            this.admissionService.current(this.personId).then((response) => {

                this.admissionService.get(response.admissionId).then((admission) => {
                    this.admission = admission;
                });

                this.admissionService.startEncounter(response.wardId, response.admissionId).then((response) => {
                    this.encounterId = response.id;
                });

            });

        }

        onSaved = (wardId: string) => {
            this.wardCheckListService.getByWard(wardId).then((response) => {
                this.wardCheckListTopics = response;
                if (this.wardCheckListTopics.length > 0) {
                    let dlg = this.dialog.confirm("Information", "The selected ward has got check list. Do you want to attend to them?");
                    dlg.result.then((btn) => {
                        this.state.go("consultation.management.changeWards.checkList", { wardId: wardId });
                    }, (error) => {
                         this.state.go("consultation.workspace");
                    });

                } else {
                     this.state.go("consultation.workspace");
                }

            }, (error) => {
                 this.state.go("consultation.workspace");
            });

        }

        onClosed = () => {
            this.state.go("consultation.purpose.list", { personId: this.personId, workareaId: this.workareaId });
        }

    }
    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/trans/change-ward/change.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationManagementChangeWardLayout", new Component());

}
