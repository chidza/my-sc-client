namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientDrugHistory extends ng.IController {

    }

    class Controller implements IArtPatientDrugHistory {

        $router: any;
        artId: string;
        personId: string;
        workareaId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }

         $onInit = (): void => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }

        onAdd = () => {

            this.state.go("consultation.management.artRegistration.drugHistory.select");

        }

        onEdit = (id: string) => {
            this.state.go("consultation.management.artRegistration.drugHistory.edit", { personMedicationId: id });

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = " app/ui/workspace/consultation/art/registration/drug-history/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtDrugHistoryListLayout", new Component());

}
