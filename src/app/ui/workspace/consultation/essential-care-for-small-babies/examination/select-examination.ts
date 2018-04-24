namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IStateParamsService extends ng.ui.IStateParamsService {
        personId: string;
        examinationId: string;
        encounterId: string;
        essentialBabyCareId: string;
    }

    class Controller implements ng.IController {

        personId: string;
        examinationId: string;
        encounterId: string;
        essentialBabyCareId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            params: IStateParamsService) {
            this.personId = params.personId;
            this.examinationId = params.examinationId;
            this.encounterId = params.encounterId;
            this.essentialBabyCareId = params.essentialBabyCareId;


        }


        close = (): void => {
            this.state.go("consultation.management.essentialCareForBabies.listExamination", { essentialBabyCareId: this.essentialBabyCareId });
        }

        selectExamination = (id: string) => {

            // go to shell with add dialogue component
            this.state.go("consultation.management.essentialCareForBabies.addExamination", { essentialBabyCareId: this.essentialBabyCareId, examinationEcbId: id });
        }


    }

    class Component implements ng.IComponentOptions {



        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/examination/select-examination.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientEssentialCareForBabiesSelectExaminationLayout", new Component());

}
