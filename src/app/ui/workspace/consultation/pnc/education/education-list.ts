namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);


    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        workspaceId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.workspaceId = params["workspaceId"];
        }


        add = () => {
            this.state.go("consultation.management.pnc.healthEducation.select");
        }

        edit = (id: string) => {
            this.state.go("consultation.management.pnc.healthEducation.edit", { encounterPersonHealthEducationId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/education/education-list.html",
            public controllerAs = "vm",
            public controller = Controller) {
        }
    }

    app.component("mrsConsultationPatientPncHealthEducationListLayout", new Component());

}
