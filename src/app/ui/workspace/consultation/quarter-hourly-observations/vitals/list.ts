namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        encounterId: string;
        deliveryId: string;
        quarterHourlyId: string;

        static $inject = ["DeliveryService", "$stateParams", "SiteSettingService"];
        constructor(
            private deliveryService: data.IDeliveryService,
            params: ng.ui.IStateParamsService,
            private siteSettingService: data.ISiteSettingService
        ) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.deliveryId = params["deliveryId"];
            this.quarterHourlyId = params["quarterHourlyId"];
        }

        $onInit = () => {

            this.deliveryService.current(this.personId).then((response) => {
                this.deliveryId = response.id;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/quarter-hourly-observations/vitals/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {

            };

        }
    }

    app.component("mrsConsultationPatientQuarterHourlyVitalListLayout", new Component());

}
