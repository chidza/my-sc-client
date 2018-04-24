namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);



    class Controller implements ng.IController {

        personId: string;
        artId: string;

        static $inject = ["$state", "$stateParams", "PersonInvestigationService", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private personInvestigationService: data.IPersonInvestigationService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
            console.log(params);

        }

        $onInit = (): void => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }

        onEdit = (id: string) => {
            this.personInvestigationService.get(id).then((response) => {
                this.state.go("consultation.management.artRegistration.investigationHistory.edit", { artId: this.artId, personInvestigationId: id, investigationId: response.investigationId });

            });

        }

        onAdd = () => {
            this.state.go("consultation.management.artRegistration.investigationHistory.add");

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/investigation-history/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtInvestigationHistoryListLayout", new Component());

}
