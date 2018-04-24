namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryHistoryDialog extends ng.IController {

    }

    class Controller implements IDeliveryHistoryDialog {

        deliveryHistoryId: string;
        deliveryId: string;
        deliveryHistory: data.IDeliveryHistory;
        datePickerOpenStatus = {};
        anc: data.IAnc;
        number: string;

        static $inject = ["DeliveryHistoryService", "AncService"];
        constructor(private deliveryHistoryService: data.IDeliveryHistoryService,
            private ancService: data.IAncService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {

            if (this.deliveryHistoryId) {
                this.deliveryHistoryService.get(this.deliveryHistoryId).then((response) => {
                    this.deliveryHistory = response;
                    console.log(this.deliveryHistory);

                    // check for anc details
                    this.ancService.getByDelivery(this.deliveryId).then((response) => {
                        console.log(response);
                        this.anc = response;
                    }, (error) => {
                    });

                }, (error) => {
                    console.log(error);
                });
            }
        }

        createUpdateAnc = () => {
            this.ancService.getByDelivery(this.deliveryId).then((response) => {
                this.ancService.update(this.anc).then((response) => {
                    console.log("anc record updated successfully.........");
                });
            }, (error) => {
                console.log(error);
            });
        }

        update = () => {
            if (this.deliveryHistory.membranesRuptured === false) {
                this.deliveryHistory.timeOfRupture = null;
            }

            if (this.deliveryHistory.contraction === false) {
                this.deliveryHistory.timeOfOnSet = null;
                this.deliveryHistory.duration = null;
            }

            console.log(this.deliveryHistory);
            this.deliveryHistoryService.update(this.deliveryHistory).then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
        }

        openCalendar = (date: any) => {
            this.datePickerOpenStatus[date] = true;
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/history/delivery-history.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryHistoryId: "<",
                deliveryId: "<"
            };

        }
    }

    app.component("mrsDeliveryHistoryDialog", new Component());

}
