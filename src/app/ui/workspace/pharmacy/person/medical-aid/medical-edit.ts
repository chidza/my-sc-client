namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IMedicalAidList extends ng.IController {

    }

    class Controller implements IMedicalAidList {
        personId: string;
        medicalAidId: string;
        $router: any;


        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
            this.medicalAidId = next.params.id;
        }

        onClose = (id: string) => {
            this.$router.navigate(["PharmacyPeopleMedicalAid", { personId: this.personId }]);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/person/medical-aid/medical-edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"

            };

        }
    }

    app.component("mrsPharmacyPeopleMedicalAidEdit", new Component());

}
