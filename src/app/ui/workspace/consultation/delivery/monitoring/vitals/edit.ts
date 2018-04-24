namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        encounterVitalId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.encounterVitalId = params["encounterVitalId"];

            console.log(params);
            console.log("ndasvika muno");
        }

        close = (): void => {
            this.state.go("consultation.management.deliveryMonitoring.vitals.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/monitoring/vitals/edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliveryMonitoringVitalEditLayout", new Component());
                   

}
