namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IMissingVitals extends ng.IController {

    }

    class Controller implements IMissingVitals {

        personId: string;
        start: string;
        end: string;

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(

            public templateUrl = "app/ui/widgets/partogram/missing-information/missing-vitals/missing-vitals.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                start: "<",
                end: "<",
                personId: "<"
            };

        }
    }

    app.component("mrsMissingVitals", new Component());

}