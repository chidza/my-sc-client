namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

       personId: string;
        workspaceId: string;
        encounterVitalId: string;
        encounterId: string;

         static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.workspaceId = params["workspaceId"];
            this.encounterId = params["encounterId"];
            this.encounterVitalId = params["encounterVitalId"];
        }


        add = (): void => {
            this.state.go("consultation.management.pnc.vitals.select");
        }

         edit = (id: string): void => {
            this.state.go("consultation.management.pnc.vitals.edit", { encounterVitalId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/vitals/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientPncVitalListLayout", new Component());


}
