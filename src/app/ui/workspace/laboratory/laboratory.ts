namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/laboratory/laboratory.html";
        controllerAs = "vm";
        $routeConfig = [{
            path: "/",
            component: "mrsLaboratoryOverview",
            name: "LaboratoryOverview",
            useAsDefault: true
        }];

        $canActivate = ["Principal", (Principal: security.IPrincipal) => {
            return true; // Principal.hasAnyAuthority(["ROLE_RECEPTION"]);
        }];

    }

    app.component("mrsLaboratory", new Component());

}