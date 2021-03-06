namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEncounterNote extends ng.IController {

    }

    class Controller implements IEncounterNote {
        encounterId: string;
        encounterNoteId: string;
        $router: any;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.encounterId = params["encounterId"];
            this.encounterNoteId = params["encounterNoteId"];
        }


        onAdd = () => {
            console.log("Tapinda......///////////");
            this.state.go("consultation.management.delivery.notes.add");
        }

        onEdit = (id: string) => {
            console.log(id, "in shell########");
            this.state.go("consultation.management.delivery.notes.edit", { encounterNoteId: id });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/notes/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryEncounterNoteListLayout", new Component());

}
