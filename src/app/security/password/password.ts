namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        password: string = "";
        confirmPassword: string;
        doNotMatch: string = null;
        error: string = null;
        success: string = null;
        account: security.IIdentity;
        $router: any;

        static $inject = ["Auth", "Principal", "dialogs"];
        constructor(private Auth: IAuth,
            private Principal: IPrincipal,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onInit = () => {
            this.Principal.identity().then((response) => {
                this.account = response;
            });
        }

        changePassword = (): void => {
            if (this.password !== this.confirmPassword) {
                this.error = null;
                this.success = null;
                this.doNotMatch = "ERROR";
            } else {
                this.doNotMatch = null;
                this.Auth.changePassword(this.password, (e: any) => {
                    let dlg = this.dialog.notify("Password Management", "Password successfully updated");

                    dlg.closed.then(() => {
                        this.Auth.logout();
                        this.$router.navigate(["Login"]);
                    });

                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/security/password/password.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsUserPassword", new Component());

}
