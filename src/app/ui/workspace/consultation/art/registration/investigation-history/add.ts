namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientInvestigationHistoryAdd extends ng.IController {

    }

    class Controller implements IArtPatientInvestigationHistoryAdd {

        $router: any;
        personInvestigationId: string = "";
        artId: string;
        personId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
        }

        $routerOnActivate = (next: any): void => {
            this.artId = next.params.artId;

        }
        onSelect = (id: string) => {
            this.state.go("consultation.management.artRegistration.investigationHistory.edit", { personInvestigationId: this.personInvestigationId, investigationId: id });

        }

        onCancel = () => {
             this.state.go("consultation.management.artRegistration.investigationHistory", { artId: this.artId });

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/investigation-history/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtInvestigationHistoryAddLayout", new Component());

}
