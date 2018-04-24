namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleMedicalAid extends ng.IController {

  }

  class Controller implements IPharmacyPeopleMedicalAid {
    personId: string;
    $router: any;

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;

    }
    onAdd = (id: string) => {
      this.$router.navigate(["PharmacyPeopleMedicalAidAdd", { personId: this.personId }]);
    }
    onEdit = (id: string) => {
      console.log(id);
      this.$router.navigate(["PharmacyPeopleMedicalAidEdit", { personId: this.personId, id: id }]);
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/medical-aid/medical-list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"

      };

    }
  }

  app.component("mrsPharmacyPeopleMedicalAid", new Component());

}
