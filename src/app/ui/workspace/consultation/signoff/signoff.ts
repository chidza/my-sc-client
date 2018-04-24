namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        workareaId: string;
        workspaceId: string;
        encounterId: string;

        static $inject = ["$stateParams", "$state", "dialogs"];
        constructor(params: ng.ui.IStateParamsService,
            private state: ng.ui.IStateService,
            private dialog: ng.dialogservice.IDialogService) {
            this.workspaceId = params["workspaceId"];
            this.workareaId = params["workareaId"];
            this.encounterId = params["encounterId"];
        }

        isAdmissionModule = () => {
            return this.workspaceId === "admission";
        }

        onExitPatientFile = () => {
            let msg = "You are about to navigate without providing an outcome for encounter. Are you sure you want to close file?";

            this.dialog.confirm("Confirm action", msg).result.then(() => {
                this.state.go("consultation.patients", { workareaId: this.workareaId });
            }, () => {
                this.state.go("consultation.purpose.list");
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/signoff/signoff.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientPurposeSignoffLayout", new Component());

}
