namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);


    class Controller implements ng.IController {

        personId: string;
        artId: string;
        personInvestigationId: string;
        investigationId: string;
        investigationHistory = {} as data.IArtInvestigationHistory;

        static $inject = ["$state", "$stateParams", "ArtService", "PersonInvestigationService", "ArtInvestigationHistoryService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService,
            private personInvestigationService: data.IPersonInvestigationService,
            private artInvestigationHistoryService: data.IArtInvestigationHistoryService) {
            this.personId = params["personId"];
            this.personInvestigationId = params["personInvestigationId"];
            this.investigationId = params["investigationId"];
        }
        $onInit = () => {
            this.artService.getByPersonId(this.personId).then((response) => {
                 this.artId = response.id;
            });
        }


        onCancel = () => {
            this.state.go("consultation.management.artRegistration.investigationHistory.list", { artId: this.artId });


        }
        onSave = (id: string) => {
            if (!this.personInvestigationId) {
                this.personInvestigationService.get(id).then((response) => {
                    this.investigationHistory.personInvestigationId = id;
                    this.investigationHistory.artId = this.artId;
                    this.artInvestigationHistoryService.save(this.investigationHistory).then((response) => {
                        this.state.go("consultation.management.artRegistration.investigationHistory.list", { artId: this.artId });

                    });
                });
            } else {
                this.state.go("consultation.management.artRegistration.investigationHistory.list", { artId: this.artId });

            }

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/investigation-history/edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtInvestigationHistoryEditLayout", new Component());

}
