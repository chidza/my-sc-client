namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryNote extends ng.IController {

    }

    class Controller implements IDeliveryNote {

        $router: any;
        personId: string;
        encounterId: string;
        encounterNoteId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.encounterId = params["encounterId"];
        }

        /*$onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;
            });
        }*/


        onClose = () => {
            console.log("closing");
            this.state.go("consultation.management.delivery.notes.list");
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/notes/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryEncounterNoteAddLayout", new Component());

}
