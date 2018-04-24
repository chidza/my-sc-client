namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {
        encounterDiagnosisId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.encounterDiagnosisId = params["encounterDiagnosisId"];
            console.log("munooooo", this.encounterDiagnosisId);

        }

        close = (): void => {
            this.state.go("consultation.management.consult.diagnoses.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/diagnoses/edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultDiagnosisEditLayout", new Component());

}
