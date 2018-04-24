namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);


    class Controller implements ng.IController {

        artVisitId: string;
        personId: string;
        workareaId: string;
        artId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams", "ArtModuleService", "ArtVisitService"];

        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artModuleService: data.IArtModuleService,
            private artVisitService: data.IArtVisitService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.artVisitId = params["artVisitId"];
            this.encounterId = params["encounterId"];
        }

        setFunctionalStatus = (personArtFunctionalStatusId: string): void => {
            this.state.go("consultation.management.art.visit.functionalState");

        }
        changePersonArtFollowUpStatus = (personArtFollowUpStatusId: string) => {
            this.state.go("consultation.management.art.visit.followUpStatus");

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/visit/visit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtVisitListLayout", new Component());

}
