namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IContrationPartogramView extends ng.IController {
    }

    class Controller implements IContrationPartogramView {

        date: string;
        deliveryId: string;

        contractionsList: Array<data.IContraction> = [];


        static $inject = ["ContractionService", "dialogs"];
        constructor(private contractionService: data.IContractionService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.deliveryId && this.date) {
                this.contractionService.getContractionsByDeliveryIdAndDate(this.deliveryId, this.date).then((reponse) => {
                    this.contractionsList = reponse;
                });
            }
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/contractions/view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsContrationPartogramView", new Component());

}
