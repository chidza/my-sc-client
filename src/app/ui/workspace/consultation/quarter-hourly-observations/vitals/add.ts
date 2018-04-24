namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IStateParams extends ng.ui.IStateParamsService {
        personId: string;
        vitalId: string;
        encounterId: string;
        quarterHourlyId: string;

    }

    class Controller implements ng.IController {

        personId: string;
        vitalId: string;
        encounterId: string;
        deliveryId: string;
        quarterHourlyId: string;

        static $inject = ["DeliveryService", "$state", "$stateParams"];
        constructor(
            private deliveryService: data.IDeliveryService,
            private state: ng.ui.IStateService,
            private params: IStateParams) {
            this.personId = params["personId"];
            this.vitalId = params["vitalId"];
            this.encounterId = params["encounterId"];
            this.quarterHourlyId = params["quarterHourlyId"];

            console.log("parammmssssss", params);
        }


        $onInit = () => {

            this.deliveryService.current(this.personId).then((response) => {
                this.deliveryId = response.id;
            });
        }

        close = (): void => {
            this.state.go("consultation.management.quarterly-hourly.overview");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/quarter-hourly-observations/vitals/add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientQuarterHourlyVitalAddLayout", new Component());

}
