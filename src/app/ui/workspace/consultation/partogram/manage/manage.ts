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
            console.log(id, "idddddddddddddddddddddd");
            this.state.go("consultation.management.partogram.record", { deliveryPartogramId: id });
        }

        onView = (id: string) => {
            this.state.go("consultation.management.partogram.view", { deliveryPartogramId: id });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/partogram/manage/manage.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientPartogramManageLayout", new Component());

}
