namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateOptions) {
            this.personId = params["personId"];
            this.workareaId = params["workareaId"];
        }

        onClose = () => {
            this.state.go("consultation.patients", { workareaId: this.workareaId });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/signoff/next.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientSignoffNextQueueLayout", new Component());

}