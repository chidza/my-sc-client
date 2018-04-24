namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryContraction extends ng.IController {

    }

    class Controller implements IDeliveryContraction {

        $router: any;
        personId: string;
        encounterId: string;
        delivery = {} as data.IDelivery;
        deliveryId: string;
        contractionId: string;

        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.deliveryId = params["deliveryId"];
            this.encounterId = params["encounterId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;
            });
        }


        onClose = () => {
            console.log("closing");
            this.state.go("consultation.management.deliveryMonitoring.contractions.list");
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/monitoring/contraction/contraction-add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryMonitoringcontractionAddLayout", new Component());

}
