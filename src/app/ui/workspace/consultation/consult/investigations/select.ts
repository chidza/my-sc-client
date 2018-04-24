namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
        }

        select = () => {
            this.state.go("consultation.management.consult.investigations.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/investigations/select.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientConsultInvestigationSelectLayout", new Component());

}