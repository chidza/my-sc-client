namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        personVitalId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.personVitalId = params["personVitalId"];
        }

        close = (): void => {
            this.state.go("consultation.management.imnci.vitals.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = " app/ui/workspace/consultation/imnci/vitals/edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientImnciVitalEditLayout", new Component());

}
