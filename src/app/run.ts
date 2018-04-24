namespace mrs {

    "use strict";

    let app = angular.module(mrs.appName);

    class Run {

        static $inject = ["$rootScope", "$log", "Auth"];
        constructor(root: ng.IRootScopeService, log: ng.ILogService, Auth: security.IAuth) {

           /* Auth.login({
                username: "Super",
                password: "password",
                rememberMe: true
            }, (response: any) => {

            });*/

        }
    }

    app.run(Run);

}
