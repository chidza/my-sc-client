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

        essentialBabyCareId: string;
        static $inject = ["$state", "$stateParams"];
        constructor(
            private state: ng.ui.IStateService,
            params: IStateParamsService
        ) {
            this.essentialBabyCareId = params.essentialBabyCareId;
        }

        select = (id: string) => {
            this.state.go("consultation.management.essentialCareForBabies.vitalsadd", {essentialBabyCareId: this.essentialBabyCareId,  vitalId: id });
        }

        close = (): void => {
            this.state.go("consultation.management.essentialCareForBabies.listExamination", { essentialBabyCareId: this.essentialBabyCareId });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/vitals/select.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsEssentialBabiesCarePatientConsultVitalSelectLayout", new Component());

}