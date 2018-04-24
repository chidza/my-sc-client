namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        error: string = null;
        errorEmailNotExists: string = null;

        resetAccount = {} as IIdentity;
        success: string = null;

        static $inject = ["Auth"];
        constructor(private Auth: IAuth) {

        }

        requestReset = () => {

            this.error = null;
            this.errorEmailNotExists = null;

            this.Auth.resetPasswordInit(this.resetAccount.email, () => { });

        }

    }

}

