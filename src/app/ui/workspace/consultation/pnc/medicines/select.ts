namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        medicationId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
        }


        select = (medicationId: string): void => {
            this.state.go("consultation.management.pnc.medicines.add", { medicationId: medicationId });
        }

         close = (): void => {
            this.state.go("consultation.management.pnc.medicines.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/medicines/select.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientPncMedicineSelectLayout", new Component());

}