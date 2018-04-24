namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/warehouse/warehouse.html";
        controllerAs = "vm";
        $routeConfig = [{
            path: "/",
            component: "mrsWarehouseOverview",
            name: "WarehouseOverview",
            useAsDefault: true
        }];

        $canActivate = ["Principal", (Principal: security.IPrincipal) => {
            return true; // Principal.hasAnyAuthority(["ROLE_RECEPTION"]);
        }];

    }

    app.component("mrsWarehouse", new Component());

}