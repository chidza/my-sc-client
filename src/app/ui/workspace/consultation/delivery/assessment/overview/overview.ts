namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        static $inject = ["$stateParams", "DeliveryService"];
        constructor(params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService) {
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/assessment/overview/overview.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliveryAssessmentOverviewLayout", new Component());

}
