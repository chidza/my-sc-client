namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IQuarterlyHourlyObservationsList extends ng.IController {
    }

    class Controller implements IQuarterlyHourlyObservationsList {
        static $inject = ["WardService"];
        constructor(private wardService: data.IWardService) {

        }

        $onInit = () => {

        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/quarter-hourly-observations/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsQuarterlyHourlyObservationsList", new Component());

}
