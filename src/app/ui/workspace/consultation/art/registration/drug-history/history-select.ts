namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientDrugHistorySelect extends ng.IController {

    }

    class Controller implements IArtPatientDrugHistorySelect {

        $router: any;
        artId: string;
        personId: string;
        workareaId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }

        $onInit = (): void => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }

        onSelected = (id: string) => {
            this.state.go("consultation.management.artRegistration.drugHistory.add", { drugNameId: id });

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/drug-history/history-select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtDrugHistorySelectLayout", new Component());

}
