namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personInvestigationId: string;
        personInvestigationTestId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personInvestigationId = params["personInvestigationId"];
            this.personInvestigationTestId = params["personInvestigationTestId"];
        }


        close = (): void => {
            this.state.go("consultation.management.art.investigations.tests.list");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/investigations/tests-edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientArtInvestigationTestEditLayout", new Component());

}
