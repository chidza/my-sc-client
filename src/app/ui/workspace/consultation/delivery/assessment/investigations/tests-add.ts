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
            this.state.go("consultation.management.deliveryAssessment.investigations.tests.list");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/assessment/investigations/tests-add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliveryAssessmentInvestigationTestAddLayout", new Component());

}
