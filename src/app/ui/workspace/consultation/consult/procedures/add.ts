namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IStateParams extends ng.ui.IStateParamsService {
        procedureId: string;
        personId: string;
        encounterId: string;
    }

    class Controller implements ng.IController {

        personId: string;
        procedureId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: IStateParams) {
            this.personId = params.personId;
            this.procedureId = params.procedureId;
            this.encounterId = params.encounterId;
        }


        close = (): void => {
            this.state.go("consultation.management.consult.procedures.list");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/procedures/add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultProcedureAddLayout", new Component());

}
