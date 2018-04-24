namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IStateParamsService extends ng.ui.IStateParamsService{
        personId: string;
        examinationId: string;
        encounterId: string;
    }

    class Controller implements ng.IController {

        personId: string;
        examinationId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: IStateParamsService) {
            this.personId = params.personId;
            this.examinationId = params.examinationId;
            this.encounterId = params.encounterId;
        }


        close = (): void => {
            this.state.go("consultation.management.consult.examinations.list");
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/examinations/add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultExaminationAddLayout", new Component());

}
