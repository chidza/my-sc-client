namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonId {

    }
    interface IDispense extends ng.IController {

    }

    class Controller implements IDispense {

        $router: any;
        person: data.IPerson;
        personId: string;
        static $inject = ["PersonService", "PrescriptionService"];
        constructor(private personService: data.IPersonService,
            private prescriptionService: data.IPrescriptionService) {

        }

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;

            this.personService.get(this.personId).then((response) => {
                this.person = response;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        $routeConfig = [{
            path: "/overview/:personId",
            component: "mrsPharmacyDispenseOverview",
            name: "PharmacyDispenseOverview",
            useAsDefault: true
        }, {
            path: "/:personId/prescription-dispense/add/:id",
            component: "mrsPharmacyDispensePrescriptionAdd",
            name: "PharmacyDispensePrescriptionAdd"
        }, {
            path: "/:personId/otc-dispense/add/:id",
            component: "mrsPharmacyDispenseAdd",
            name: "PharmacyDispenseAdd"
        }, {
            path: "/:personId/dispense/edit/:id",
            component: "mrsPharmacyDispenseEdit",
            name: "PharmacyDispenseEdit"
        }, {
            path: "/:personId/dispense/select",
            component: "mrsPharmacyDispenseSelect",
            name: "PharmacyDispenseSelect"
        }, {
            path: "/:personId/prescritions",
            component: "mrsDispensePrescriptions",
            name: "DispensePrescriptions"
        }];

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/dispense/dispense.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };
        }
    }

    app.component("mrsPharmacyDispense", new Component());

}
