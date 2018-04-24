namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        htsId: string;
        personInvestigationId: string;

        static $inject = ["$state", "$stateParams", "HtsService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private htsService: data.IHtsService) {
            this.htsId = params["htsId"];
            this.personInvestigationId = params["personInvestigationId"];
        }

        close = (): void => {
            this.state.go("consultation.management.hts.test.list");
        }



    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/hts/test-add/test-add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientHtsTestAddLayout", new Component());

}
