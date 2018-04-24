namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryPartogramNote extends ng.IController {

    }

    class Controller implements IDeliveryPartogramNote {
        personId: string;
        delivery: data.IDelivery;
        deliveryId: string;
        $router: any;

        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.deliveryId = params["deliveryId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;
            });
        }

        onAdd = () => {
            console.log("deliveryId", this.deliveryId);
            this.state.go("consultation.management.partogram.partogramNotes.add");
        }

        onEdit = (id: string) => {
            this.state.go("consultation.management.partogram.partogramNotes.edit", {partogramNoteId: id});
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/partogram/partogram-notes/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientPartogramPartogramNoteListLayout", new Component());

}
