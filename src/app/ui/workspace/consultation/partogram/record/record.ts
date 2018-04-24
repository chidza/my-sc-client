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
            console.log("trying very hard");
            this.state.go("consultation.management.partogram.overview", {deliveryId: this.deliveryId});
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/workspace/consultation/partogram/record/record.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientPartogramRecordLayout", new Component());

}
