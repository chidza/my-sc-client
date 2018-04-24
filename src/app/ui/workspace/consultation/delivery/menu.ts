namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        deliveryId: string;
        personId: string;
        workareaId: string;

        static $inject = ["$stateParams", "DeliveryService"];
        constructor(params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService) {
            this.personId = params["personId"];
            this.workareaId = params["workareaId"];
        }

        $onInit = () => {
            this.deliveryService.current(this.personId).then((response) => {
                this.deliveryId = response.id;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliveryMenuLayout", new Component());

}
