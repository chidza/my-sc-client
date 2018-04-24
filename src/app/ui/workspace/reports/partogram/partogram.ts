namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        static $inject = ["$state"];
        constructor(private state: ng.ui.IStateService) { }

        preview = (deliveryId: string) => {
            this.state.go("reports.preview", { deliveryId: deliveryId });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/reports/partogram/partogram.html",
            public controllerAs = "vm",
            public controller = Controller) { }
    }

    app.component("mrsReportsPartogramLayout", new Component());

}
