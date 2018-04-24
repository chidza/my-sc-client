namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        workspaceId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.workspaceId = params["workspaceId"];
        }

        open = (id: string) => {
            this.state.go("consultation.patients", { workareaId: id });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/workspace.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsWorkspaceLayout", new Component());

}