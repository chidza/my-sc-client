namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPharmacyPeopleContactDetailPhoneEdit extends ng.IController {

    }

    class Controller implements IPharmacyPeopleContactDetailPhoneEdit {
        personId: string;
        phoneId: string;
        personPhone: data.IPhone;
        $router: any;

        static $inject = ["PhoneService", "dialogs"];
        constructor(private personPhoneService: data.IPhoneService,
            private dialog: ng.dialogservice.IDialogService) {

        }

       $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
            this.phoneId = next.params.phoneId;
       }

        onClose = () => {
            this.$router.navigate(["PharmacyPeopleContactDetail", { personId: this.personId, phoneId: this.phoneId }]);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/person/contact-details/edit-phone.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"

            };

        }
    }

    app.component("mrsPharmacyPeopleContactDetailPhoneEdit", new Component());

}
