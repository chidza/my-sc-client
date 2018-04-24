namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryDelivery extends ng.IController {

    }

    class Controller implements IDeliveryDelivery {
        childId: string;
        personId: string;
        deliverySummaryId: string;
        delivery: data.IDelivery;
        $router: any;

        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.childId = params["childId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliverySummaryId = this.delivery.deliverySummaryId;
            });

        }

        close = (): void => {
            this.state.go("consultation.management.deliverySummary.birth.person", { childId: this.childId });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/infant-resuscitation/resuscitation.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliverySummaryResuscitationLayout", new Component());

}
