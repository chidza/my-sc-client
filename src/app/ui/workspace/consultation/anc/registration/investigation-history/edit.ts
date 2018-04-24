namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);


    class Controller implements ng.IController {

        personId: string;
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
            /*    this.artService.getByPersonId(this.personId).then((response) => {
                    this.artId = response.id;
               }); */
        }


        onCancel = () => {
            this.state.go("consultation.management.ancregistration.investigationHistory.list");


        }
        onSave = (id: string) => {
            this.state.go("consultation.management.ancregistration.investigationHistory.list");

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/investigation-history/edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationAncDeliveryInvestigationHistoryEditLayout", new Component());

}
