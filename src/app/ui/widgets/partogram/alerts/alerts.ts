namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramAlertsView extends ng.IController {
        closed: () => void;
    }

    class Controller implements IPartogramAlertsView {
        start: string;
        end: string;
        deliveryId: string;
        personId: string;
        public closed: () => void;

        static $inject = ["DeliveryService"];
        constructor(private deliveryService: data.IDeliveryService) {

        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId) {
                this.deliveryService.get(this.deliveryId).then((response) => {
                    this.personId = response.personId;
                });

                this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                    this.start = response.startTime;
                    if (response.endTime) {
                        this.end = response.endTime;
                    } else {
                        this.end = moment().format("YYYY-MM-DDTHH:mm:00");
                    }

                });
            }
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/alerts/alerts.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
            };

        }
    }

    app.component("mrsPartogramAlertsView", new Component());

}
