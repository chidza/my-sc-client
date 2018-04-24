namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryDelivery extends ng.IController {

    }

    class Controller implements IDeliveryDelivery {
        encounterId: string;
        personId: string;
        deliverySummaryId: string;
        delivery: data.IDelivery;
        $router: any;

        static $inject = ["$stateParams", "DeliveryService", "dialogs"];
        constructor(private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliverySummaryId = this.delivery.deliverySummaryId;

            });

        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/delivery/delivery.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliverySummaryDeliveryLayout", new Component());

}
