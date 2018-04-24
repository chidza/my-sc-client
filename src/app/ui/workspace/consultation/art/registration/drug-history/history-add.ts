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
        artMedicationHistory = {} as data.IArtMedicationHistory;
        static $inject = ["$state", "$stateParams", "ArtMedicationHistoryService", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artMedicationHistoryService: data.IArtMedicationHistoryService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
            this.drugNameId = params["drugNameId"];
        }

        $onInit = (): void => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }

        onClose = () => {
            this.state.go("consultation.management.artRegistration.drugHistory.list");
        }

        onSave = (id: string) => {
            this.artMedicationHistory.artId = this.artId;
            this.artMedicationHistory.personMedicationId = id;
            this.artMedicationHistoryService.save(this.artMedicationHistory).then((response) => {
                this.state.go("consultation.management.artRegistration.drugHistory.list");
            });

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/drug-history/history-add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtDrugHistoryAddLayout", new Component());

}
