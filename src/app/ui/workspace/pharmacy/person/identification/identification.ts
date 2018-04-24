namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleIdentification extends ng.IController {

  }

  class Controller implements IPharmacyPeopleIdentification {
    personId: string;
    $router: any;

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
      console.log(next.params);
    }

    onAdd = () => {

      this.$router.navigate(["PharmacyPeopleIdentificationAdd", { personId: this.personId }]);
    }

    onEdit = (id: string) => {
      console.log("id" + id);
      this.$router.navigate(["PharmacyPeopleIdentificationEdit", { personId: this.personId, id: id }]);
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/identification/identification.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyPeopleIdentification", new Component());

}
