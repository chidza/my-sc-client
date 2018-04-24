namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ILoginDialog extends ng.IController {

    }

    class Controller implements ILoginDialog {

        username: string;
        password: string;
        processing: boolean = false;
        //$router: any;

        componentInstruction: any;

        static $inject = ["Auth", "Principal", "dialogs", "$state"];
        constructor(private Auth: security.IAuth,
            private Principal: security.IPrincipal,
            private dialog: ng.dialogservice.IDialogService,
            private state: ng.ui.IStateService) {

        }

        /*$routerOnActivate = (next: any): void => {
            this.componentInstruction = next;
        }*/

        logon = () => {

            this.processing = true;

            this.Auth.login({
                username: this.username,
                password: this.password,
                rememberMe: true
            }, (response: any) => {

                this.Principal.identity().then((response) => {
                    if ((response == null) || (response.login === "anonymoususer")) {
                        this.password = "";
                        this.dialog.error("Authentication Error", "Invalid log on credentials");
                    } else {
                        this.state.go("dashboard");
                    }
                });

                this.processing = false;

            });


        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/authentication/login/login.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsLoginDialogLayout", new Component());

}
