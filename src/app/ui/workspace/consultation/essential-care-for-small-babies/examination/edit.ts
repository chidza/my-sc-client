namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        encounterExaminationId: string;
        essentialBabyCareId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.encounterExaminationId = params["encounterExaminationId"];
            this.essentialBabyCareId = params["essentialBabyCareId"];
            console.log(params);
        }

        close = (): void => {
            console.log(this.essentialBabyCareId, "essentialBabyCareId");
             this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/examination/edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
             }

    }

    app.component("mrsEcbConsultationPatientEssentialCareForBabiesEditExaminationLayout", new Component());

}
