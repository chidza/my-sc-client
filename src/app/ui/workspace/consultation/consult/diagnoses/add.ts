namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);
    interface IStateParams extends ng.ui.IStateParamsService {
        diagnosisId: string;
        personId: string;
        encounterId: string;
    }

    class Controller implements ng.IController {

        personId: string;
        diagnosisId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: IStateParams) {
            this.personId = params.personId;
            this.diagnosisId = params.diagnosisId;
            this.encounterId = params.encounterId;
        }


        close = (): void => {
            this.state.go("consultation.management.consult.diagnoses.list");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/diagnoses/add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultDiagnosisAddLayout", new Component());

}
