namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/reports/reports.html";
        controllerAs = "vm";
        $canActivate = ["Principal", (Principal: security.IPrincipal) => {
            return true; // Principal.hasAnyAuthority(["ROLE_RECEPTION"]);
        }];

    }

    app.component("mrsReportsLayout", new Component());

}