namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        workspaceId: string;
        personId: string;
        workareaId: string;
        opdId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams", "ConsultationService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateOptions,
            private consultationService: data.IConsultationService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.workareaId = params["workareaId"];
            this.workspaceId = params["workspaceId"];
        }

        $onInit = () => {
            this.consultationService.generalEncounter(this.workspaceId, this.workareaId, this.personId).then((encounter) => {
                this.encounterId = encounter.id;
            }, (error) => {
                this.dialog.error("Discharge Error", "Could not discharge patient at this time");
            });
        }

        onCancel = () => {
            this.state.go("consultation.purpose.list");
        }

        onSave = () => {
            this.state.go("consultation.patients", { workareaId: this.workareaId });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/signoff/discharge.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientSignoffDischargeLayout", new Component());

}