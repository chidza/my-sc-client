namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personInvestigationTestId: string;
        htsId: string;
        personInvestigationId: string;

        static $inject = ["$state", "$stateParams", "HtsService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private htsService: data.IHtsService) {
            this.personInvestigationTestId = params["personInvestigationTestId"];
            this.htsId = params["htsId"];
        }

        $onInit = (): void => {
            this.htsService.get(this.htsId).then((response) => {
                this.personInvestigationId = response.investigationId;
            });
        }

        close = (): void => {
            this.state.go("consultation.management.hts.test.list");
        }



    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/hts/test-edit/test-edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientHtsTestEditLayout", new Component());

}
