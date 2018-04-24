namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        keyMissing: boolean = true;
        confirmPassword: string;
        doNotMatch: string;
        error: string;

        // this.login = LoginService.open;
        resetAccount: any = {};
        success: string = null;

        static $inject = ["$stateParams", "Auth"];
        constructor(private $stateParams: ng.ui.IStateParamsService, private Auth: security.IAuth) {
            this.keyMissing = angular.isUndefined(this.$stateParams["key"]);
        }

        finishReset = () => {
            this.doNotMatch = null;
            this.error = null;
            if (this.resetAccount.password !== this.confirmPassword) {
                this.doNotMatch = "ERROR";
            } else {
                this.Auth.resetPasswordFinish({ key: this.$stateParams["key"], newPassword: this.resetAccount.password }, () => { }).then((response: any) => {
                    this.success = "OK";
                }, () => {
                    this.success = null;
                    this.error = "ERROR";
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/account/reset/finish/reset.finish.html";
        controller = Controller;
        controllerAs = "vm";
    }

    app.component("mrsResetFinish", new Component());

}