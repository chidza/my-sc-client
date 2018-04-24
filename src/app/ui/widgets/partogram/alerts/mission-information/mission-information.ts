namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramMissionInformationView extends ng.IController {
    }


    class Controller implements IPartogramMissionInformationView {
        start: string;
        end: string;
        deliveryId: string;
        missingInformation: Array<data.IPartogramMissingInfoView> = [];


        static $inject = ["DeliveryService", "PartogramInformationService"];
        constructor(private deliveryService: data.IDeliveryService,
            private partogramService: data.IPartogramInformationService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId) {
                this.partogramService.getMissingInformation(this.deliveryId).then((response) => {
                    this.missingInformation = response;
                });
            }
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/alerts/mission-information/mission-information.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
            };

        }
    }

    app.component("mrsPartogramMissionInformationView", new Component());

}
