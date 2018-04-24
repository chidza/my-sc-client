namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IStateParams extends ng.ui.IStateParamsService {
        personId: string;
        vitalId: string;
        encounterId: string;
    }

    class Controller implements ng.IController {

        personId: string;
        vitalId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: IStateParams) {
            this.personId = params["personId"];
            this.vitalId = params["vitalId"];
            this.encounterId = params["encounterId"];
        }


        close = (): void => {
            this.state.go("consultation.management.consult.vitals.list");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = " app/ui/workspace/consultation/consult/vitals/add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultVitalAddLayout", new Component());

}
