namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        personInvestigationId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.personInvestigationId = params["personInvestigationId"];
        }


        add = (): void => {
            this.state.go("consultation.management.anc.investigations.tests.add");
        }

        edit = (id: string): void => {
            this.state.go("consultation.management.anc.investigations.tests.edit", { personInvestigationTestId: id });
        }

        close = (id: string): void => {
            this.state.go("consultation.management.anc.investigations.list");
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/investigations/tests-list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientAncInvestigationTestListLayout", new Component());

}
