namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientExamination extends ng.IController {

    }

    class Controller implements IArtPatientExamination {

        artId: string;
        personInvestigationId: string;
        investigationId: string;
        personId: string;
        encounterId: string;
        art: data.IArt;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.personInvestigationId = params["personInvestigationId"];
            this.investigationId = params["investigationId"];
        }

        $onInit = (): void => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.art = response;
                this.personId = response.personId;
            });
        }

        onSave = (id: string) => {
            this.art.investigationId = id;
            this.artService.update(this.art).then((response) => {
                this.state.go("consultation.management.artRegistration.examinations");
            });

        }

        onClose = () => {
            this.state.go("consultation.management.artRegistration.examinations");
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/set-hiv/set.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {

            };

        }
    }

    app.component("mrsConsultationPatientArtSetHiv", new Component());

}
