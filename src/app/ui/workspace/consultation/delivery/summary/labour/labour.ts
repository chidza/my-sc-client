namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        labourSummaryId: string;
        deliveryId: string;
        static $inject = ["$state", "$stateParams", "DeliveryService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService) {
            this.deliveryId = params["deliveryId"];
        }

        $onInit = () => {
            this.deliveryService.get(this.deliveryId).then((response) => {
                this.labourSummaryId = response.labourSummaryId;
            })
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/labour/labour.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliverySummaryLabourLayout", new Component());

}
