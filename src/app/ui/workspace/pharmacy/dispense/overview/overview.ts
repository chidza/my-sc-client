namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IDispenseOverview extends ng.IController {

  }

  class Controller implements IDispenseOverview {
    personId: string;
    $router: any;
    person: data.IPerson;

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

    onAdd = () => {
      this.$router.navigate(["PharmacyDispenseSelect", { personId: this.personId}]);
    }

    onEdit = (id: string) => {
      this.$router.navigate(["PharmacyDispenseEdit", { personId: this.personId, id: id }]);
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/dispense/overview/overview.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyDispenseOverview", new Component());

}
