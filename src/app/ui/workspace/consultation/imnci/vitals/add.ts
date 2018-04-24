namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        vitalId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.vitalId = params["vitalId"];
            this.encounterId = params["encounterId"];
        }


        close = (): void => {
            this.state.go("consultation.management.imnci.vitals.list");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/imnci/vitals/add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientImnciVitalAddLayout", new Component());

}