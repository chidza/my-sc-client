namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryMembrane extends ng.IController {

    }

    class Controller implements IDeliveryMembrane {

        personId: string;
        encounterId: string;
        delivery: data.IDelivery;
        placentaMembraneId: string;


        static $inject = ["$stateParams", "DeliveryService", "dialogs"];
        constructor(private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            console.log(params);
        }
        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.placentaMembraneId = this.delivery.placentaAndMembraneId;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/membranes/membranes.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }
    }

    app.component("mrsConsultationPatientDeliverySummaryMembranesLayout", new Component());

}
