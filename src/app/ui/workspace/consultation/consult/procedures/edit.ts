namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        encounterProcedureId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {

            this.encounterProcedureId = params["encounterProcedureId"];
        }

        close = (): void => {
            this.state.go("consultation.management.consult.procedures.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/procedures/edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultProcedureEditLayout", new Component());

}
