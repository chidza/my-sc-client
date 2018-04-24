namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        artVisitId: string;
        personId: string;
        workareaId: string;

        static $inject = ["$state", "$stateParams"];

        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artModuleService: data.IArtModuleService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.artVisitId = params["artVisitId"];
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/new-oi/new-oi.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }
    }

    app.component("mrsConsultationPatientArtNewOiList", new Component());

}
