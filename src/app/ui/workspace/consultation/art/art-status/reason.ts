namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientArtStatusReason extends ng.IController {

    }

    class Controller implements IArtPatientArtStatusReason {
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
            public templateUrl = "app/ui/workspace/consultation/art/art-status/reason.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientArtStatusesReasons", new Component());

}
