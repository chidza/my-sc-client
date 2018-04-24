namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        educationTopicId: string;
        encounterId: string;
        encounterHealthEducationId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.educationTopicId = params["educationTopicId"];
            this.encounterId = params["encounterId"];
            this.encounterHealthEducationId = params["encounterHealthEducationId"];
        }


        close = (): void => {
            this.state.go("consultation.management.anc.education.list");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/education/add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientAncEducationAddLayout", new Component());

}
