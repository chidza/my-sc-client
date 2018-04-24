namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        login: string;
        user: data.IUser;

        public saved: (login: Object) => void;

        public closed: () => void;

        authorities = ["ROLE_RECEPTION", "ROLE_NURSE", "ROLE_NURSE_AID",
            "ROLE_DOCTOR", "ROLE_PHARMACIST", "ROLE_LAB_TECH", "ROLE_WAREHOUSE"];

        static $inject = ["UserService", "dialogs"];
        constructor(private userService: data.IUserService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onChanges = () => {
            if (this.login) {
                this.userService.get(this.login).then((response) => {
                    this.user = response;
                }, (e) => {
                    this.dialog.error("User Management", "Errors occured retrieving data for user.");
                });
            } else {
                this.user = {
                    langKey: "en",
                    activated: true
                } as data.IUser;
            }
        }

        save = () => {
            if (this.user.id > 0) {
                this.onSave(this.userService.update(this.user));
            } else {
                this.onSave(this.userService.save(this.user));
            }
        }

        onSave = (promise: ng.IPromise<data.IUser>) => {
            promise.then((response) => {
                this.saved({ login: response.login });
            }, () => {
                this.dialog.error("User Management", "Errors occured updating user details");
            });
        }

        close = () => {
            this.closed();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/users/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                login: "<",
                saved: "&",
                closed: "&"
            };

        }
    }

    app.component("mrsUserDialog", new Component());

}