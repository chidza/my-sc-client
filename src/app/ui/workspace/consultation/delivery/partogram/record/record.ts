namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryPartogramNewRecord extends ng.IController {

    }

    class Controller implements IDeliveryPartogramNewRecord {

        deliveryPartogramId: string;
        date: string;
        encounterId: string;
        deliveryId: string;

        static $inject = ["$state", "$stateParams", "PartogramInformationService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private deliveryPartogramService: data.IPartogramInformationService) {
            this.deliveryPartogramId = params["deliveryPartogramId"];
            this.encounterId = params["encounterId"];
            this.deliveryId = params["deliveryId"];
        }

        $onInit = (): void => {

            this.deliveryPartogramService.get(this.deliveryPartogramId).then((response) => {
                this.date = moment(response.date).format("YYYY-MM-DDTHH:mm:00");
            });
        }
        onClose = () => {
            this.state.go("consultation.management.deliveryPartogram.overview");
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/partogram/record/record.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryPartogramRecordLayout", new Component());

}
