namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IVaginalMonitoringDialog extends ng.IController {
        closed: () => void;
    }

    class Controller implements IVaginalMonitoringDialog {
        user: string;
        date: string;
        deliveryId: string;
        personId: string;
        encounterId: string;
        public closed: () => void;

        static $inject = ["DeliveryService", "Principal"];
        constructor(private deliveryService: data.IDeliveryService,
            private Principal: security.IPrincipal) {

        }

        $onInit = () => {
            this.Principal.identity().then((response) => {
                this.user = response.lastName + " " + response.firstName;
            });
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId && this.date) {
                this.deliveryService.get(this.deliveryId).then((response) => {
                    this.personId = response.personId;
                });
            }
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/form-view/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                date: "<",
                deliveryId: "<",
                closed: "&"
            };

        }
    }

    app.component("mrsPartogramFormView", new Component());

}
