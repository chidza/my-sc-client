namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        workspaceId: string;
        essentialBabyCareId: string;

        static $inject = ["EssentialBabiesCareService", "EncounterMedicationService", "$state", "$stateParams"];
        constructor(
            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private encounterMedicationService: data.IEncounterMedicationService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.workspaceId = params["workspaceId"];
            this.essentialBabyCareId = params["essentialBabyCareId"];
        }

        addDispense = (): void => {
            this.state.go("consultation.management.essentialCareForBabies.selectMedicinedispense", { essentialBabyCareId: this.essentialBabyCareId });
        }

        editPrescription = (id: string): void => {
            this.state.go("consultation.management.essentialCareForBabies.editMedicinedispense", { essentialBabyCareId: this.essentialBabyCareId, prescriptionId: id });
        }

        deleteDispense = (id: string): void => {
console.log("activating delete...");
            this.encounterMedicationService.get(id).then((response) => {
                console.log("response from this shitty service");
                console.log(response);
                this.essentialBabiesCareService.deleteEssentialBabiesCareExaminations(this.essentialBabyCareId, response.id).then((response) => {
                    console.log("response from this assssssyyy service");
                    console.log(response);
                    this.state.go("consultation.management.essentialCareForBabies.listExamination", { essentialBabyCareId: this.essentialBabyCareId });

                });



            });
        }


        add = (): void => {

            this.state.go("consultation.management.essentialCareForBabies.selectMedicine", { essentialBabyCareId: this.essentialBabyCareId });
        }

        edit = (id: string): void => {
            this.state.go("consultation.management.essentialCareForBabies.editMedicine", { essentialBabyCareId: this.essentialBabyCareId, prescriptionId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/medication/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsEssentialBabiesCarePatientArtMedicineListLayout", new Component());

}