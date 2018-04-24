namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryVaginalMonitoring extends ng.IController {

    }

    class Controller implements IDeliveryVaginalMonitoring {

        $router: any;
        personId: string;
        encounterId: string;
        deliveryId: string;
        delivery: data.IDelivery;
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
            
             this.state.go("consultation.management.deliveryMonitoring.vaginals.add");
        }

        onEdit = (id: string) => {
             this.state.go("consultation.management.deliveryMonitoring.vaginals.edit", {vaginalId: id});
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/monitoring/vaginal/vaginal.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryMonitoringVaginalListLayout", new Component());

}
