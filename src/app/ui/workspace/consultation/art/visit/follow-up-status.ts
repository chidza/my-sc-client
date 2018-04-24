namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IFollowUpStateDialog extends ng.IController {

    }

    class Controller implements IFollowUpStateDialog {

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

        onSelected = () => {
            this.state.go("consultation.management.art.visit.list");
        }

        close = () => {
            this.state.go("consultation.management.art.visit.list");
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/visit/follow-up-status.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtVisitFollowUpStatusLayout", new Component());

}
