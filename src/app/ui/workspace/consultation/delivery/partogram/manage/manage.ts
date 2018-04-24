namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryPartogramManage extends ng.IController {

    }

    class Controller implements IDeliveryPartogramManage {

        deliveryId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService) {
            this.deliveryId = params["deliveryId"];

        }

        onEdit = (id: string) => {
            this.state.go("consultation.management.deliveryPartogram.record", { deliveryPartogramId: id });
        }

        onView = (id: string) => {
            this.state.go("consultation.management.deliveryPartogram.view", { deliveryPartogramId: id });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/partogram/manage/manage.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryPartogramManageLayout", new Component());

}
