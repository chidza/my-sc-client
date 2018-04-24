namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryVaginalMonitoringEdit extends ng.IController {

    }

    class Controller implements IDeliveryVaginalMonitoringEdit {

        $router: any;
        personId: string;
        encounterId: string;
        deliveryId: string;
        delivery: data.IDelivery;
        vaginalId: string;
        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.deliveryId = params["deliveryId"];
            this.vaginalId = params["vaginalId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;
            });
        }
        onClose = (id: string) => {
            this.state.go("consultation.management.deliveryMonitoring.vaginals.list");
        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/monitoring/vaginal/vaginal-edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryMonitoringVaginalEditLayout", new Component());

}
