namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IDispenseOverview extends ng.IController {

  }

  class Controller implements IDispenseOverview {
    personId: string;
    drugId: string;
    frequencyId: string;
    prescriptionId: string;
    $router: any;

    person: data.IPerson;
    prescription: data.IPrescription;

    static $inject = ["PersonService", "PrescriptionService"];
    constructor(private personService: data.IPersonService,
      private prescriptionService: data.IPrescriptionService) {

    }

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
      this.prescriptionId = next.params.id;

      this.prescriptionService.get(this.prescriptionId).then((response) => {
        this.prescription = response;
        this.frequencyId = response.frequencyId;
        this.drugId = response.drugId;
      });

      this.personService.get(this.personId).then((response) => {
        this.person = response;
      });

    }
    onClose = () => {
      this.$router.navigate(["DispensePrescriptions", { personId: this.personId }]);
    }

    onSave = (id: string) => {
      this.prescription.dispenseId = id;
      this.prescriptionService.update(this.prescription).then((response) => {
        this.$router.navigate(["DispensePrescriptions", { personId: this.personId }]);
      });

    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/dispense/prescriptions/dispense-new.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };
    }
  }

  app.component("mrsPharmacyDispensePrescriptionAdd", new Component());

}
