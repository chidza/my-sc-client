namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryNote extends ng.IController {

    }

    class Controller implements IDeliveryNote {

        $router: any;
        personId: string;
        encounterId: string;
        babiesNoteId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.encounterId = params["encounterId"];
            this.babiesNoteId = params["babiesNoteId"];
        }


        onClose = () => {
            console.log("closing");
            this.state.go("consultation.management.essentialCareForBabies.babiesNotes.list");
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/essential-care-notes/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientEssentialCareForBabiesNoteAddLayout", new Component());

}
