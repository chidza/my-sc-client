namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IComponentName extends ng.IController {

    }

    class Controller implements IComponentName {

        personId: string;

        encounterId: string;

        delivery: data.IDelivery;

        $router: any;

        static $inject = ["DeliveryService", "dialogs"];
        constructor(private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
            this.encounterId = next.params.encounterId;

            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "path_to_component.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsComponentName", new Component());

}
