namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDispenseOverview extends ng.IController {

    }

    class Controller implements IDispenseOverview {
        personId: string;
        $router: any;

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;

        }
        onSelect = (id: string) => {
            this.$router.navigate(["PharmacyDispenseAdd", { personId: this.personId, id: id }]);
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/dispense/overview/dispense-select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };
        }
    }

    app.component("mrsPharmacyDispenseSelect", new Component());

}
