namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryMedicalHistory extends ng.IController {

    }

    class Controller implements IDeliveryMedicalHistory {

        encounterId: string;
        deliveryId: string;
        personId: string;
        static $inject = ["$stateParams", "DeliveryService"];

        constructor(params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService) {
                this.personId = params["personId"];
                this.deliveryId = params["deliveryId"];
             }

        $routerOnActivate = (next: any): void => {

            this.personId = next.params.personId;

            this.deliveryService.current(this.personId).then((response) => {
                this.deliveryId = response.id;

            });


        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/history/medical-history/medical-history.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryRegistrationMedicalHistoryLayout", new Component());

}
