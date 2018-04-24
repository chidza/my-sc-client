namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        encounterId: string;

        personInvestigation = {} as data.IPersonInvestigation;
        static $inject = ["$state", "$stateParams", "EncounterInvestigationService","ArtModuleService"];
        constructor(private state: ng.ui.IStateService, params: ng.ui.IStateParamsService,
            private encounterInvestigationService: data.IEncounterInvestigationService,
             private artModuleService: data.IArtModuleService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
        }

        onPerformTest = (id: string) => {
            this.personInvestigation.personId = this.personId;
            this.personInvestigation.date = new Date();
            this.personInvestigation.investigationId = id;
            this.encounterInvestigationService.saveEncounterInvestigation(this.encounterId, this.personInvestigation).then((test) => {
                this.state.go("consultation.management.art.investigations.tests.list", { personInvestigationId: test.personInvestigationId });
            });




        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/overview.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientArtOverviewLayout", new Component());

}
