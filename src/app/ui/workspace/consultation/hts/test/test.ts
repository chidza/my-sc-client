namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        htsId: string;
        investigationId: string;

        static $inject = ["$state", "$stateParams", "HtsService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private htsService: data.IHtsService) {
            this.htsId = params["htsId"];
        }

        $onInit = (): void => {
            this.htsService.get(this.htsId).then((response) => {
                this.investigationId = response.investigationId;
            });
        }

        add = (): void => {
            this.state.go("consultation.management.hts.test.add", { personInvestigationId: this.investigationId });
        }

        edit = (id: string): void => {
            this.state.go("consultation.management.hts.test.edit", { personInvestigationTestId: id });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/hts/test/test.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientHtsTestListLayout", new Component());

}
