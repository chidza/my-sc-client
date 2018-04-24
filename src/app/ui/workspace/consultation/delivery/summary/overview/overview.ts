namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService) {

        }

        $onInit = () => {

        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/overview/overview.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliverySummaryOverviewLayout", new Component());

}
