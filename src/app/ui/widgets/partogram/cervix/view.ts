namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ICervixPartogramView extends ng.IController {
    }

    class Controller implements ICervixPartogramView {

        deliveryId: string;
        cervix = {} as data.ICervix;
        levels: Array<data.ILevelOfPresentingPart> = [];
        date: string;
        // descentStatus: data.IDescentStatus;


        static $inject = ["CervixService", "LevelOfPresentingPartService", "DeliveryService", "dialogs", "DateUtils"];
        constructor(private cervixService: data.ICervixService,
            private levelOfPresentingPartService: data.ILevelOfPresentingPartService, private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService, private dateUtils: utils.IDateUtils) {

        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {

            if (this.deliveryId && this.date) {
                this.cervixService.getCervixesByDeliveryDateTime(this.deliveryId, this.date).then((response) => {
                    this.cervix = response;
                });
            }
        }
        $onInit = () => {
            this.levelOfPresentingPartService.query().then((response) => {
                this.levels = response;
            });
        }

        getDescent = (id: string): String => {
            let result: String = "";
            if (this.levels) {
                this.levels.forEach((l) => {
                    if (l.id === id) {
                        result = l.name;
                    }
                });
            }
            return result;
        }
    }
    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/cervix/view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsCervixPartogramView", new Component());

}
