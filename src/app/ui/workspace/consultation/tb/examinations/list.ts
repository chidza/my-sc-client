namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

         personId: string;
        encounterExaminationId: string;
        encounterId: string;
        workspaceId: number;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterExaminationId = params["encounterExaminationId"];
            this.encounterId = params["encounterId"];
            this.workspaceId = params["workspaceId"];
            console.log(params);
        }


        add = (): void => {
            this.state.go("consultation.management.tb.examinations.select");
        }

        edit = (id: string): void => {
            this.state.go("consultation.management.tb.examinations.edit", { encounterExaminationId: id });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/tb/examinations/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientTbExaminationListLayout", new Component());

}
