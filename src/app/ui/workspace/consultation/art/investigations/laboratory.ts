namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personInvestigationId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personInvestigationId = params["personInvestigationId"];
        }


        close = (): void => {
            this.state.go("consultation.management.art.investigations.list");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/investigations/laboratory.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientArtInvestigationLaboratoryLayout", new Component());

}
