namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPharmacyPeopleContactDetailAddressAdd extends ng.IController {

    }

    class Controller implements IPharmacyPeopleContactDetailAddressAdd {
        personId: string;
        addressId: string;
        districtId: string;
        provinceId: string;
        personAddress: data.IPersonAddress;
        $router: any;

        static $inject = ["PersonAddressService", "dialogs"];
        constructor(private personAddressService: data.IPersonAddressService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
        }

        onClose = () => {
            this.$router.navigate(["PharmacyPeopleContactDetail", { personId: this.personId, addressId: this.addressId }]);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/person/contact-details/add-address.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"

            };

        }
    }

    app.component("mrsPharmacyPeopleContactDetailAddressAdd", new Component());

}
