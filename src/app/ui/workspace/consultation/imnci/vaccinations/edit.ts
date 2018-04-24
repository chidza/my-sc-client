namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        dispenseId: string;

        personMedicationId: string;
        drugId: string;

        static $inject = ["$state", "$stateParams", "DispenseService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private dispenseService: data.IDispenseService) {
            this.personId = params["personId"];
            this.dispenseId = params["dispenseId"];
        }

        $onInit = () => {
            this.dispenseService.get(this.dispenseId).then((response) => {
                this.personMedicationId = response.personMedicationId;
                this.drugId = response.drugId;
            });
        }


        close = (): void => {
            this.state.go("consultation.management.imnci.vaccinations.list");
        }



    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/imnci/vaccinations/edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientImnciVaccinationEditLayout", new Component());

}
