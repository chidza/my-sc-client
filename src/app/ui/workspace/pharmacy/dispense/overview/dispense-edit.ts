namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDispenseOverview extends ng.IController {

    }

    class Controller implements IDispenseOverview {
        personId: string;
        drugId: string;
        frequencyId: string;
        dispenseId: string;
        $router: any;

        person: data.IPerson;
        prescription: data.IPrescription;

        static $inject = ["PersonService", "PersonMedicationService", "DispenseService"];
        constructor(private personService: data.IPersonService,
            private personMedicationService: data.IPersonMedicationService,
            private dispenseService: data.IDispenseService) {

        }

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
            this.dispenseId = next.params.id;
            this.dispenseService.get(this.dispenseId).then((response) => {
                this.frequencyId = response.frequencyId;
                this.drugId = response.drugId;

            });

        }
        onClose = () => {
            this.$router.navigate(["PharmacyDispenseOverview", { personId: this.personId }]);
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/dispense/overview/dispense-edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };
        }
    }

    app.component("mrsPharmacyDispenseEdit", new Component());

}
