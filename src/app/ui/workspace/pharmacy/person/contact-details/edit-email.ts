namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPharmacyPeopleContactDetailEmailEdit extends ng.IController {

    }

    class Controller implements IPharmacyPeopleContactDetailEmailEdit {
        personId: string;
        emailId: string;
        personEmail: data.IEmail;
        $router: any;

        static $inject = ["EmailService", "dialogs"];
        constructor(private personEmailService: data.IEmailService,
            private dialog: ng.dialogservice.IDialogService) {

        }

       $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
            this.emailId = next.params.emailId;

       }

        onClose = () => {
            this.$router.navigate(["PharmacyPeopleContactDetail", { personId: this.personId, emailId: this.emailId }]);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/person/contact-details/edit-email.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"

            };

        }
    }

    app.component("mrsPharmacyPeopleContactDetailEmailEdit", new Component());

}
