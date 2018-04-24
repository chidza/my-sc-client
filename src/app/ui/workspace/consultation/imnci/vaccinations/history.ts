namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        dispenseId: string;
        personMedicationId: string;
        drugNameId: string;

        static $inject = ["$state", "$stateParams", "PersonMedicationService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private personMedicationService: data.IPersonMedicationService) {
            this.personId = params["personId"];
            this.dispenseId = params["dispenseId"];
            this.personMedicationId = params["personMedicationId"];
        }

        $onInit = () => {
            this.personMedicationService.get(this.personMedicationId).then((response) => {
                this.drugNameId = response.drugNameId;
            });
        }


        close = (): void => {
            this.state.go("consultation.management.imnci.vaccinations.list");
        }



    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/imnci/vaccinations/history.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientImnciVaccinationHistoryLayout", new Component());

}
