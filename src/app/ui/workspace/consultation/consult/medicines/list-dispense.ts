namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        workspaceId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.workspaceId = params["workspaceId"];
        }


        add = (): void => {
            this.state.go("consultation.management.consult.medicines.select");
        }

        addDispense = (): void => {
            this.state.go("consultation.management.consult.medicines.select-dispense");
        }

        editPrescription = (id: string): void => {
            this.state.go("consultation.management.consult.medicines.edit", { prescriptionId: id });
        }

        editDispense = (id: string): void => {
            this.state.go("consultation.management.consult.medicines.edit-dispense", { encounterMedicationId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/medicines/list-dispense.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultMedicineListDispenseLayout", new Component());

}