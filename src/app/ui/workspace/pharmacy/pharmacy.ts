namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/pharmacy/pharmacy.html";
        controllerAs = "vm";
        $routeConfig = [{
            path: "/search",
            component: "mrsPharmacySearch",
            name: "PharmacySearch",
            useAsDefault: true
        }, {
            path: "/registration",
            component: "mrsPharmacyRegistration",
            name: "PharmacyRegistration"
        }, {
            path: "/people/:personId/...",
            component: "mrsPharmacyPeople",
            name: "PharmacyPeople"
        }, {
            path: "/dispense/:personId/...",
            component: "mrsPharmacyDispense",
            name: "PharmacyDispense"
        }];

        $canActivate = ["Principal", (Principal: security.IPrincipal) => {
            return Principal.hasAnyAuthority(["ROLE_PHARMACISTS", "ROLE_LAB_TECH"]);
        }];

    }

    app.component("mrsPharmacy", new Component());

}