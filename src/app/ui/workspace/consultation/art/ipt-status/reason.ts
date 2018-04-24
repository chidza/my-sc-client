namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personArtIptStatusId: string;

        static $inject = ["$state", "$stateParams", "ArtModuleService"];

        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artModuleService: data.IArtModuleService) {
            this.personArtIptStatusId = params["personArtIptStatusId"];
        }

        onSelected = (artId: string): void => {
            this.state.go("consultation.management.art.iptStatus.list");
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/ipt-status/reason.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtIptReasonListLayout", new Component());

}
