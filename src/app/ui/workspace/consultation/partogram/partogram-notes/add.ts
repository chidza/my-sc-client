namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryPartogramNote extends ng.IController {

    }

    class Controller implements IDeliveryPartogramNote {

        $router: any;
        personId: string;
        encounterId: string;
        delivery = {} as data.IDelivery;
        deliveryId: string;
        partogramNoteId: string;

        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.deliveryId = params["deliveryId"];
            this.encounterId = params["encounterId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;
            });
        }


        onClose = () => {
            console.log("closing");
            this.state.go("consultation.management.partogram.partogramNotes.list");
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/partogram/partogram-notes/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientPartogramPartogramNoteAddLayout", new Component());

}
