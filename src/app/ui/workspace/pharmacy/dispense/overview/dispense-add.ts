namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDispenseOverview extends ng.IController {

    }

    class Controller implements IDispenseOverview {
        personId: string;
        drugId: string;
        frequencyId: string;
        $router: any;

        person: data.IPerson;
        prescription: data.IPrescription;

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
            this.drugId = next.params.id;
        }
        onClose = () => {
            this.$router.navigate(["PharmacyDispenseOverview", { personId: this.personId }]);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/dispense/overview/dispense-add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };
        }
    }

    app.component("mrsPharmacyDispenseAdd", new Component());

}
