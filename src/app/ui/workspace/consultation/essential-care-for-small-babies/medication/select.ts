namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        medicationId: string;
        essentialBabyCareId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.essentialBabyCareId = params["essentialBabyCareId"];
        }


        close = (): void => {
            this.state.go("consultation.management.essentialCareForBabies.listMedicine", { essentialBabyCareId: this.essentialBabyCareId });
        }

        select = (medicationId: string): void => {
            this.state.go("consultation.management.essentialCareForBabies.addMedicine", { essentialBabyCareId: this.essentialBabyCareId, medicationId: medicationId });
        }



    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/medication/select.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsEssentialBabiesCarePatientArtMedicineSelectLayout", new Component());

}