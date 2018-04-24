namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        personInvestigationId: string;
        essentialBabyCareId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.personInvestigationId = params["personInvestigationId"];
            this.essentialBabyCareId = params["essentialBabyCareId"];

        }


        add = (): void => {
            console.log("this.essentialBabyCareId in tests here");
            console.log(this.essentialBabyCareId);
            this.state.go("consultation.management.essentialCareForBabies.investigationstests.add", { essentialBabyCareId: this.essentialBabyCareId });
        }

        edit = (id: string): void => {
            this.state.go("consultation.management.essentialCareForBabies.investigationstests.edit", { essentialBabyCareId: this.essentialBabyCareId, personInvestigationTestId: id });
        }

        close = (id: string): void => {
            this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/investigations/tests-list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsEssentialBabiesCarePatientInvestigationTestListLayout", new Component());

}
