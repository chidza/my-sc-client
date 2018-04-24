namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        encounterVitalId: string;
        quarterHourlyId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.encounterVitalId = params["encounterVitalId"];
            this.quarterHourlyId = params["quarterHourlyId"];
            console.log(params);

        }

        close = (): void => {
            this.state.go("consultation.management.quarterly-hourly.overview");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/quarter-hourly-observations/vitals/edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientQuarterHourlyVitalEditLayout", new Component());

}
