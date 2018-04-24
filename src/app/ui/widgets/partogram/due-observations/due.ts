namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramDueObservationsView extends ng.IController {

    }

    class Controller implements IPartogramDueObservationsView {
        deliveryId: string;
        personId: string;
        refresh: number;
        observations: Array<data.IPartogramDueObservationView> = [];
        date: Date;
        overdue: boolean = false;
        deliveryWards: Array<data.IDeliveryWardNotification> = [];
        nextTimeToCapture: Date = new Date();

        static $inject = ["DeliveryService", "PartogramInformationService", "WebSocketService", "$scope"];
        constructor(private deliveryService: data.IDeliveryService,
            private partogramService: data.IPartogramInformationService,
            private websocket: utils.IWebSocketService,
            private scope: ng.IScope) {

        }

        $onInit = () => {
            this.websocket.connect();

            this.websocket.subscribe("/topic/delivery-partogram-saved");

            this.websocket.message = (data: any) => {
                this.init();
            };


        }

        $onDestroy = () => {
            this.websocket.unsubscribe();
            this.websocket.disconnect();


        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();

        }

        init = () => {
            if (this.deliveryId) {
                this.overdue = false;
                this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                    if (response.startTime) {
                        this.partogramService.getDueObservations(this.deliveryId).then((response) => {
                            this.observations = response;
                        });

                        this.partogramService.getLast(this.deliveryId).then((response) => {
                            this.date = new Date(moment(response.date).add(30, "minutes"));
                            if (moment() > moment(this.date)) {
                                this.overdue = true;
                            }
                        });
                    }
                });

            }
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/due-observations/due.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                refresh: "<",
                deliveryId: "<",
            };

        }
    }

    app.component("mrsPartogramDueObservationsView", new Component());
}