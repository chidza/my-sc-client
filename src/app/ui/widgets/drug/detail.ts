namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDrugDetail extends ng.IController {

    }

    class Controller implements IDrugDetail {
        drugId: string;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/drug/detail.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                drugId: "<"
            };

        }
    }

    app.component("mrsDrugDetail", new Component());

}
