namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryPartogramPreviewPrint extends ng.IController {

    }

    class Controller implements IDeliveryPartogramPreviewPrint {

        personId: string;

        deliveryId: string;
        $router: any;
        start: string;
        end: string;
        from: string;
        to: string;
        delivery = {} as data.IDelivery;
        partogramNotes: Array<data.IPartogramNote> = [];

        static $inject = ["DeliveryService", "$state", "$stateParams", "PartogramNoteService"];
        constructor(private deliveryService: data.IDeliveryService,

            private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private partogramNoteService: data.IPartogramNoteService) {

            this.personId = params["personId"];


        }


        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;

                if (this.deliveryId) {
                    this.partogramNoteService.getPartogramNotes(this.deliveryId).then((response) => {
                        this.partogramNotes = response;
                    });
                }

                this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                    if (response.startTime)
                        this.start = response.startTime;
                    if (response.startTime)
                        this.end = response.endTime;
                });
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partograph-print-pdf/print.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"

            };

        }
    }

    app.component("mrsDeliveryPartogramPreviewPrint", new Component());

}