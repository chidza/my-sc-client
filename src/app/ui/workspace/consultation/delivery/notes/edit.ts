namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryEncounterNote extends ng.IController {

    }

    class Controller implements IDeliveryEncounterNote {
        personId: string;
        encounterId: string;
        encounterNoteId: string;
        $router: any;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.encounterNoteId = params["encounterNoteId"];
            this.encounterId = params["encounterId"];
        }

        onClose = () => {
            this.state.go("consultation.management.delivery.notes.list");
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/notes/edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryEncounterNoteEditLayout", new Component());

}
