namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliverySocialHistory extends ng.IController {

    }

    class Controller implements IDeliverySocialHistory {

        encounterId: string;
        deliveryId: string;
        personId: string;
        ancId: string;
        static $inject = ["$stateParams", "DeliveryService", "AncService"];
        constructor(private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
         private ancService: data.IAncService) {
             this.personId = params["personId"];
             this.deliveryId = params["deliveryId"];
             console.log(params);
          }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.deliveryId = response.id;
                this.ancService.getByDelivery(this.deliveryId).then((response) => {
                    this.ancId = response.id;
                });
            });


        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/history/social-history/social-history.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryRegistrationSocialHistoryLayout", new Component());

}
