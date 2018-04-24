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
        $router: any;

        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.deliveryId = params["deliveryId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;
            });
        }

        onAdd = () => {
            this.state.go("consultation.management.deliveryMonitoring.cervices.add");
        }

        onEdit = (id: string) => {
           this.state.go("consultation.management.deliveryMonitoring.cervices.edit", { cervixId: id });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/monitoring/cervix/cervix.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryMonitoringCerviceListLayout", new Component());

}
