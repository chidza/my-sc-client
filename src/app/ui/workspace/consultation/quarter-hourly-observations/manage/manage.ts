namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryPartogramManage extends ng.IController {

    }

    class Controller implements IDeliveryPartogramManage {

        deliveryId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(
            private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService
        ) {
            this.deliveryId = params["deliveryId"];

        }

        onEdit = (id: string) => {
            this.state.go("consultation.management.quarterly-hourly.overview");
        }

        onView = (id: string) => {
            this.state.go("consultation.management.quarterly-hourly.vitals.list");
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/quarter-hourly-observations/manage/manage.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                
            };

        }
    }

    app.component("mrsQuarterHourlyObservations", new Component());

}
