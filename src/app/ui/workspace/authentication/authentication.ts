namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/authentication/authenication.html";
        controllerAs = "vm";
        $canActivate = ["Principal", (Principal: security.IPrincipal) => {
            return true; // Principal.hasAnyAuthority(["ROLE_RECEPTION"]);
        }];

    }

    app.component("mrsAuthenticationLayout", new Component());

}