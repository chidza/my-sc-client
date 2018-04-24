namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        static $inject = ["$state"];
        constructor(private state: ng.ui.IStateService) {
        }

        select = (id: string) => {
            this.state.go("consultation.management.consult.procedures.add", { procedureId: id });
        }

        close = () => {
            this.state.go("consultation.management.consult.procedures.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/procedures/select.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientConsultProcedureSelectLayout", new Component());

}