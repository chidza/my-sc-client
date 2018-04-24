namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IMissingInformation extends ng.IController {
    }


    class Controller implements IMissingInformation {
        start: string;
        end: string;
        deliveryId: string;

        missingDetails: Array<data.IContractionView> = [];
        static $inject = ["ContractionService"];
        constructor(private contractionService: data.IContractionService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.deliveryId && this.start) {
                this.contractionService.getMissingContractions(this.deliveryId, this.start, this.end, 30).then((response) => {
              this.missingDetails = response;

                });

            }

        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = " app/ui/widgets/partogram/missing-information/missing-contractions/missing-contractions.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "start": "@",
                "end": "@",
                deliveryId: "<",
            };

        }
    }

    app.component("mrsPartogramMissingContractions", new Component());

}
