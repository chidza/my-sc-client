namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        workspaceId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateOptions,
            private consultationService: data.IConsultationService) {
            this.personId = params["personId"];
            this.workareaId = params["workareaId"];
            this.workspaceId = params["workspaceId"];
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
            public templateUrl = "app/ui/workspace/consultation/signoff/admission.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientSignoffAdmissionLayout", new Component());

}