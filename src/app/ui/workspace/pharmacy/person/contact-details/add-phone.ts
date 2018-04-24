namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPharmacyPeopleContactDetailPhoneAdd extends ng.IController {

    }

    class Controller implements IPharmacyPeopleContactDetailPhoneAdd {
        personId: string;
        phoneId: string;
        phone: data.IPhone;
        $router: any;

        static $inject = ["PhoneService", "dialogs"];
        constructor(private personPhoneService: data.IPhoneService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
            this.phoneId = next.params.phoneId;
            this.personPhoneService.get(this.personId).then((response) => {
                this.phone = response;
            });
        }

        onClose = () => {
            this.$router.navigate(["PharmacyPeopleContactDetail", { personId: this.personId, phoneId: this.phoneId }]);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/person/contact-details/add-phone.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"

            };

        }
    }

    app.component("mrsPharmacyPeopleContactDetailPhoneAdd", new Component());

}
