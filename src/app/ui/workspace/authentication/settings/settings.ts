namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        error: string = null;

        settingsAccount = {} as IIdentity;
        success: string = null;

        static $inject = ["Auth", "Principal", "dialogs"];
        constructor(private Auth: IAuth,
            private Principal: IPrincipal,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onInit = () => {
            this.Principal.identity(false).then((account) => {
                this.settingsAccount = this.copyAccount(account);
            });
        }

        copyAccount = (account: IIdentity): IIdentity => {
            return {
                activated: account.activated,
                email: account.email,
                firstName: account.firstName,
                langKey: account.langKey,
                lastName: account.lastName,
                login: account.login,
            } as IIdentity;
        }

        save = () => {
            this.Auth.updateAccount(this.settingsAccount, () => {
                this.dialog.notify("Password Management", "Account successfully updated");
            });

            /*.then(() => {
                this.error = null;
                this.success = "OK";
                this.Principal.identity(true).then((account) => {
                    this.settingsAccount = this.copyAccount(account);
                });
            }).catch(function () {
                this.success = null;
                this.error = "ERROR";
            });*/
        }

    }

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/authentication/settings/settings.html";
        controller = Controller;
        controllerAs = "vm";
    }

    app.component("mrsUserSettingsLayout", new Component());

}

