namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterExaminationId: string;
        encounterId: string;
        workspaceId: number;
        essentialBabyCareId: string;

        static $inject = ["EncounterExaminationService", "EssentialBabiesCareService", "$state", "$stateParams"];
        constructor(
            private encounterExaminationService: data.IEncounterExaminationService,
            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterExaminationId = params["encounterExaminationId"];
            this.encounterId = params["encounterId"];
            this.workspaceId = params["workspaceId"];
            this.essentialBabyCareId = params["essentialBabyCareId"];

            console.log(params);

        }


        addExamination = (): void => {

            this.state.go("consultation.management.essentialCareForBabies.selectExamination", { essentialBabyCareId: this.essentialBabyCareId });
        }

        editExamination = (id: string): void => {
            console.log(id ,  "edit");
            this.state.go("consultation.management.essentialCareForBabies.editExamination", { essentialBabyCareId: this.essentialBabyCareId, encounterExaminationId: id });
        }

        deleteExamination = (id: string): void => {

            this.encounterExaminationService.get(id).then((response) => {

                this.essentialBabiesCareService.deleteEssentialBabiesCareExaminations(this.essentialBabyCareId, response.personExaminationId).then((response) => {

                    this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });

                });



            });
        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/examination/list-examination.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                essentialBabyCareId: "<"
            };
        }

    }

    app.component("mrsEcbConsultationPatientEssentialCareForBabiesListExaminationLayout", new Component());

}
