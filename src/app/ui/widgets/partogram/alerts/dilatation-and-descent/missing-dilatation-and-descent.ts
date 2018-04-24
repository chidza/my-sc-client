namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramDilatationAndDescentDialog extends ng.IController {
    }


    class Controller implements IPartogramDilatationAndDescentDialog {
        start: string;
        end: string;
        deliveryId: string;
        missing: boolean = false;
        missingCervixes: Array<data.ICervixView> = [];
        static $inject = ["CervixService"];
        constructor(private CervixService: data.ICervixService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.deliveryId && this.start && this.end) {
                this.CervixService.checkMissingRecordings(this.deliveryId, this.start, this.end).then((response) => {
                    this.missingCervixes = response;
                    this.missingCervixes.forEach((c) => {
                        if (c.descent === "MISSING" || c.dilatation === "MISSING") {
                            this.missing = true;
                        }
                    });
                });
            }
        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/missing-information/dilatation-and-descent/missing-dilatation-and-descent.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "start": "@",
                "end": "@",
                deliveryId: "<",
            };

        }
    }

    app.component("mrsPartogramMissingDilatationAndDescent", new Component());

}
