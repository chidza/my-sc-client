namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        artId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];

        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
        }
        $onInit = (): void => {

            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            }, (error) => {
            });
        }

        changeReason = (id: string) => {
            this.state.go("consultation.management.art.iptStatus.reason", { personArtIptStatusId: id });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/ipt-status/status.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientArtIptStatusListLayout", new Component());

}
