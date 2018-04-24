namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        deliveryId: string;

        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.deliveryId = params["deliveryId"];
        }


        partogramPrintPreview = () => {
            this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                if (response.startTime) {
                    this.state.go("consultation.management.delivery.printpreview", { deliveryId: this.deliveryId });
                } else {
                    this.dialog.notify("Delivery Summary", "Nothing to show, patient is not admitted on to the partogram!");
                }
            });
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliverySummaryMenuLayout", new Component());

}
