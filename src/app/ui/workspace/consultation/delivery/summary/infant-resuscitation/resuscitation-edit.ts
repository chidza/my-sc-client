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

        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs", "InfantService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService,
            private infantService: data.IInfantService) {
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
            this.infantService.getByChildId(this.childId).then((response) => {
                this.state.go("consultation.management.deliverySummary.birth.edit", { infantId: response.id });
            }, (error) => {
                this.state.go("consultation.management.deliverySummary.birth.list");
            });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/infant-resuscitation/resuscitation-edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliverySummaryResuscitationEditLayout", new Component());

}
