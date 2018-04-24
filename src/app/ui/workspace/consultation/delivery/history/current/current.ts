namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        deliveryId: string;
        deliveryHistoryId: string;

        static $inject = ["$stateParams", "DeliveryService"];
        constructor(params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.deliveryId = params["deliveryId"];
        }

        $onInit = () => {
            this.deliveryService.get(this.deliveryId).then((response) => {
                this.deliveryHistoryId = response.historyId;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/history/current/current.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliveryRegistrationCurrentLayout", new Component());

}
