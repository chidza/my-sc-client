namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPncRegistrationDialog extends ng.IController {
        savedPnc: (tbId: Object) => void;
        closed: () => void;
    }

    class Controller implements IPncRegistrationDialog {
        public savedPnc: (tbId: Object) => void;
        public closed: () => void;
        pncId: string;
        deliveryId: string;
        personId: string;
        age: number;
        children: Array<data.IPerson> = [];
        datePickerOpenStatus = {};
        pnc = {} as data.IPnc;
        delivery: data.IDelivery;
        person: data.IPerson;

        pastAnc = {} as data.IPastAncHistory;
        pastAncHistoryDetails = {} as data.IPastAncHistoryDetails;
        static $inject = ["PersonService", "PncService", "PncChildService", "DeliveryService", "dialogs", "AncService"];
        constructor(private personService: mrs.data.IPersonService,
            private pncService: mrs.data.IPncService,
            private pncChildService: data.IPncChildService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService,
            private ancService: data.IAncService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = (): void => {
            if (this.pncId) {
                this.pncService.get(this.pncId).then((response) => {
                    this.pnc = response;

                    this.personService.get(this.pnc.personId).then((response) => {
                        this.person = response;
                    });
                });
                this.deliveryService.getByPncId(this.pncId).then((response) => {
                    this.delivery = response;
                });
                this.pncChildService.getByPncId(this.pncId).then((response) => {
                    this.children = response;
                });
            }


        }
        close = () => {
            this.closed();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/pnc-registration/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                pncId: "<",
                closed: "&"
            };

        }
    }

    app.component("mrsPncRegistrationDialog", new Component());

}
