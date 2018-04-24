namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientArtStatus extends ng.IController {

    }

    class Controller implements IArtPatientArtStatus {

        artId: string;
        personId: string;
        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.personId = params["personId"];

        }

        $onInit = () => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }

        onChangeReason = (id: string): void => {
            this.state.go("consultation.management.art.artStatuses.reasons", { personArtStatusId: id });
        }

        onChangeRegimen = (id: string): void => {
            this.state.go("consultation.management.art.artStatuses.regimens", { personArtStatusId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/art-status/status.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientArtStatusesList", new Component());

}
