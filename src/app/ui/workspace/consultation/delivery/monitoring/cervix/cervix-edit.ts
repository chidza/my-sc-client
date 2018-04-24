namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryCervix extends ng.IController {

    }

    class Controller implements IDeliveryCervix {
        personId: string;
        encounterId: string;
        delivery: data.IDelivery;
        deliveryId: string;
        cervixId: string;
        $router: any;

        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
        private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.deliveryId = params["deliveryId"];
            this.encounterId = params["encounterId"];
            this.cervixId = params["cervixId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;
            });
        }

        onClose = () => {
            this.state.go("consultation.management.deliveryMonitoring.cervices.list");
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/monitoring/cervix/cervix-edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryMonitoringCerviceEditLayout", new Component());

}
