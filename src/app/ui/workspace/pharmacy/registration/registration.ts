namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDispenseRegistration extends ng.IController {

    }

    class Controller implements IDispenseRegistration {

        $router: any;

        // static $inject = [""];
        constructor() {

        }

        open = (personId: string) => {
            this.$router.navigate(["PharmacyPeople", { personId: personId }, "PharmacyPeopleOverview", { personId: personId }]);
        }

        cancel = () => {
            this.$router.navigate(["PharmacySearch"]);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/registration/registration.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsPharmacyRegistration", new Component());

}
