namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientInitiationReason extends ng.IController {

    }

    class Controller implements IArtPatientInitiationReason {

        artId: string;
        personId: string;
        personArtStatusId: string;
        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
            this.personArtStatusId = params["personArtStatusId"];
        }


        $onInit = (): void => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }


        onSelected = (id: string) => {
            this.state.go("consultation.management.artRegistration.artInitiations.artInitiation");
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/initiation-reason/initiation-reason.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtInitiationReason", new Component());

}
