namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        keyMissing: boolean;
        key: string;
        confirmPassword: string = null;
        doNotMatch: string = null;
        error: string = null;

        resetAccount = {} as IIdentity;
        success: string = null;

        static $inject = ["Auth"];
        constructor(private Auth: IAuth) {

        }

        $routerOnActivate = (next: any): void => {
            this.keyMissing = angular.isUndefined(next.params.key);
            this.key = next.params.key;
        }

        finishReset = () => {
            this.doNotMatch = null;
            this.error = null;
            if (this.resetAccount.password !== this.confirmPassword) {
                this.doNotMatch = "ERROR";
            } else {
                this.Auth.resetPasswordFinish({ key: this.key, newPassword: this.resetAccount.password }, () => {

                });

            }
        }

    }

}
