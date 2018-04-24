namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramDangerSignsView extends ng.IController {
    }


    class Controller implements IPartogramDangerSignsView {
        start: string;
        end: string;
        deliveryId: string;
        dangerSigns: Array<data.IPartogramDangerSignView> = [];


        static $inject = ["DeliveryService", "PartogramInformationService"];
        constructor(private deliveryService: data.IDeliveryService,
            private partogramService: data.IPartogramInformationService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId) {
                  console.log("danger>>>>>>>>", this.deliveryId);
                this.partogramService.getDangerSigns(this.deliveryId).then((response) => {
                    this.dangerSigns = response;
                  
                });
            }
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/alerts/danger-signs/danger-signs.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
            };

        }
    }

    app.component("mrsPartogramDangerSignsView", new Component());

}
