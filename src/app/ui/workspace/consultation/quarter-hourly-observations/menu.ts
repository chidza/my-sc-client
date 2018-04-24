namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

      class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
        }


    }


    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = " app/ui/workspace/consultation/quarter-hourly-observations/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientQuarterHourlyMenuLayout", new Component());


}
