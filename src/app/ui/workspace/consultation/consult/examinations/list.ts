namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterExaminationId: string;
        encounterId: string;
        workspaceId: number;
        reload: number = 1;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterExaminationId = params["encounterExaminationId"];
            this.encounterId = params["encounterId"];
            this.workspaceId = params["workspaceId"];
        }


        add = (): void => {
            this.state.go("consultation.management.consult.examinations.select");
        }

        edit = (id: string): void => {
            console.log("encounterExaminationId", id);
            this.state.go("consultation.management.consult.examinations.edit", { encounterExaminationId: id });
        }

        onDone = () => {
            this.reload = this.reload + 1;
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/examinations/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultExaminationListLayout", new Component());

}
