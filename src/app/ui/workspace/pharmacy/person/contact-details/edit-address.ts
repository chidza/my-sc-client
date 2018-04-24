namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPharmacyPeopleContactDetailAddressEdit extends ng.IController {

    }

    class Controller implements IPharmacyPeopleContactDetailAddressEdit {
        personId: string;
        addressId: string;
        personAddress: data.IPersonAddress;
        $router: any;

        static $inject = ["PersonAddressService", "dialogs"];
        constructor(private personAddressService: data.IPersonAddressService,
            private dialog: ng.dialogservice.IDialogService) {

        }

       $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
            this.addressId = next.params.addressId;
       }

        onClose = () => {
            this.$router.navigate(["PharmacyPeopleContactDetail", { personId: this.personId, addressId: this.addressId }]);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/person/contact-details/edit-address.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"

            };

        }
    }

    app.component("mrsPharmacyPeopleContactDetailAddressEdit", new Component());

}
