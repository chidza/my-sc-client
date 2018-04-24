namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        doNotMatch: string = null;
        error: string = null;
        confirmPassword: string = null;
        errorUserExists: string = null;
        errorEmailExists: string = null;
        registerAccount = {} as IIdentity;
        success: string = null;

        static $inject = ["Auth"];
        constructor(private Auth: IAuth) {

        }

        register = (): void => {
            if (this.registerAccount.password !== this.confirmPassword) {
                this.doNotMatch = "ERROR";
            } else {
                this.registerAccount.langKey = "en";
                this.doNotMatch = null;
                this.error = null;
                this.errorUserExists = null;
                this.errorEmailExists = null;

                this.Auth.createAccount(this.registerAccount, () => { });


            }
        }

    }

}