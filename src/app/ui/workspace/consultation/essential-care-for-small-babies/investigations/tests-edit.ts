namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personInvestigationId: string;
        personInvestigationTestId: string;
        essentialBabyCareId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personInvestigationId = params["personInvestigationId"];
            this.personInvestigationTestId = params["personInvestigationTestId"];
            this.essentialBabyCareId = params["essentialBabyCareId"];
        }


        close = (): void => {
            this.state.go("consultation.management.essentialCareForBabies.investigationstests.list", { essentialBabyCareId: this.essentialBabyCareId });
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/investigations/tests-edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsEssentialBabiesCarePatientInvestigationTestEditLayout", new Component());

}
