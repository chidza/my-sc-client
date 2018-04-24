namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
        encounterId: string;
        workspaceId: string;
    }

    interface IArtPatientExamination extends ng.IController {

    }

    class Controller implements IArtPatientExamination {
        personId: string;
        artId: string;
        encounterId: string;
        workspaceId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: IParams,
            private artService: data.IArtService) {
            this.personId = params.personId;
            this.encounterId = params.encounterId;
            this.workspaceId = params.workspaceId;
        }

        $onInit = (): void => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }

        onSetHiv = (personInvestigationId: string, investigationId: string) => {
            this.state.go("consultation.management.artRegistration.setHiv", { personInvestigationId: personInvestigationId, investigationId: investigationId });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/examinations/examinations.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientArtExaminations", new Component());

}
