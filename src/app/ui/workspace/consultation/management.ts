namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounters: Array<data.IEncounter> = [];
        admission: data.IAdmission = null;
        person: data.IPerson = null;
        workspaceId: string;
        workareaId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.workspaceId = params["workspaceId"];
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/management.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientManagementLayout", new Component());

}
