namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        static $inject = ["Auth"];
        constructor(private Auth: IAuth) {

        }

        $routerOnActivate = (next: any): void => {
            let key: string = next.params.key;

            this.Auth.activateAccount(key, () => { });
        }

    }

}
