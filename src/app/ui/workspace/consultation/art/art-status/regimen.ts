namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientArtStatusRegimen extends ng.IController {

    }

    class Controller implements IArtPatientArtStatusRegimen {

        personId: string;
        artId: string;
        personArtStatusId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
            this.personArtStatusId = params["personArtStatusId"];
        }

        $onInit = () => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }

        onSelected = (): void => {
            this.state.go("consultation.management.art.artStatuses.list");
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/art-status/regimen.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtStatusesRegimens", new Component());

}
