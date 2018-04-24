namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientInitiationRegimen extends ng.IController {

    }

    class Controller implements IArtPatientInitiationRegimen {


        artId: string;
        personArtStatusId: string;
        personId: string;

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
            public templateUrl = "app/ui/workspace/consultation/art/registration/initiation-regimen/initiation-regimen.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientArtInitiationRegimen", new Component());

}
