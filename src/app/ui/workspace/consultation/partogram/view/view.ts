namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryPartogramView extends ng.IController {

    }

    class Controller implements IDeliveryPartogramView {

        deliveryId: string;
        deliveryPartogramId: string;
        date: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams", "PartogramInformationService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private deliveryPartogramService: data.IPartogramInformationService) {
            this.deliveryId = params["deliveryId"];
            this.encounterId = params["encounterId"];
            this.deliveryPartogramId = params["deliveryPartogramId"];
        }

        $onInit = (): void => {
            this.deliveryPartogramService.get(this.deliveryPartogramId).then((response) => {
                this.date = moment(response.date).format("YYYY-MM-DDTHH:mm:00");
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/workspace/consultation/partogram/view/view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientPartogramViewLayout", new Component());

}
