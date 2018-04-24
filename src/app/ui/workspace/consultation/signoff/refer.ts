namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        encounterId: string;
        workareaId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateOptions) {
            this.encounterId = params["encounterId"];
            this.workareaId = params["workareaId"];
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
            public templateUrl = "app/ui/workspace/consultation/signoff/refer.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientSignoffReferLayout", new Component());

}