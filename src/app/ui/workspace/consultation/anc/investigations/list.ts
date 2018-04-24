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
            this.state.go("consultation.management.anc.investigations.select");
        }

        edit = (id: string): void => {
            this.state.go("consultation.management.anc.investigations.edit", { personInvestigationId: id });
        }

        perform = (id: string): void => {
            this.state.go("consultation.management.anc.investigations.tests.list", { personInvestigationId: id });
        }

        send = (id: string): void => {
            this.state.go("consultation.management.anc.investigations.laboratory", { personInvestigationId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/investigations/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientAncInvestigationListLayout", new Component());

}
