namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workspaceId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.workspaceId = params["workspaceId"];
            this.encounterId = params["encounterId"];
            console.log("params....", this.encounterId);
        }


        add = (): void => {
            this.state.go("consultation.management.consult.vitals.select");
        }


        edit = (id: string): void => {
            this.state.go("consultation.management.consult.vitals.edit", { encounterVitalId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/vitals/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultVitalListLayout", new Component());


}
