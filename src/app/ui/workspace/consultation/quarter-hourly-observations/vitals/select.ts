namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        static $inject = ["$state"];
        constructor(private state: ng.ui.IStateService) {
        }

        select = (id: string) => {
            this.state.go("consultation.management.quarterly-hourly.vitals.add", { vitalId: id });
        }

        close = (): void => {
            this.state.go("consultation.management.quarterly-hourly.vitals.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/quarter-hourly-observations/vitals/select.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientQuarterHourlyVitalSelectLayout", new Component());

}