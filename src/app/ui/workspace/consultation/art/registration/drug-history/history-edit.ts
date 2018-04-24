namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientDrugHistoryEdit extends ng.IController {

    }

    class Controller implements IArtPatientDrugHistoryEdit {

        $router: any;
        artId: string;
        personId: string;
        personMedicationId: string;
        drugNameId: string;
        static $inject = ["$state", "$stateParams", "PersonMedicationService", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private personMedicationService: data.IPersonMedicationService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
            this.personMedicationId = params["personMedicationId"];
        }

        $onInit = (): void => {
            this.personMedicationService.get(this.personMedicationId).then((response) => {
                this.drugNameId = response.drugNameId;
            });

            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });

        }

        onClose = () => {
            this.state.go("consultation.management.artRegistration.drugHistory.list");
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/drug-history/history-edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtDrugHistoryEditLayout", new Component());

}
