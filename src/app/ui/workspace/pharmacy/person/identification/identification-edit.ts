namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleIdentificationAdd extends ng.IController {

  }

  class Controller implements IPharmacyPeopleIdentificationAdd {
    personId: string;
    id: string;
    $router: any;

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
      this.id = next.params.id;



    }

    onClose = () => {
      this.$router.navigate(["PharmacyPeopleIdentification", { personId: this.personId }]);
    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/identification/identification-edit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyPeopleIdentificationEdit", new Component());

}
