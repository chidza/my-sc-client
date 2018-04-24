namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        encounterHealthEducationId: string;
        static $inject = ["$state", "$stateParams"];
        constructor(
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.encounterHealthEducationId = params["encounterPersonHealthEducationId"];
        }

        close = (): void => {
            this.state.go("consultation.management.anc.education.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/education/edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientAncEducationEditLayout", new Component());

}
