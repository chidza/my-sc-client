namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        workspaceId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.workspaceId = params["workspaceId"];
        }


        add = (): void => {
            this.state.go("consultation.management.consult.investigations.select");
        }

        edit = (id: string): void => {
            this.state.go("consultation.management.consult.investigations.edit", { personInvestigationId: id });
        }

        perform = (id: string): void => {
            this.state.go("consultation.management.consult.investigations.tests.list", { personInvestigationId: id });
        }

        send = (id: string): void => {
            this.state.go("consultation.management.consult.investigations.laboratory", { personInvestigationId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/investigations/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultInvestigationListLayout", new Component());

}
