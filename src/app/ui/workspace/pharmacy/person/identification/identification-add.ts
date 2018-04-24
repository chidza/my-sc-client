namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleIdentificationAdd extends ng.IController {

  }

  class Controller implements IPharmacyPeopleIdentificationAdd {
    personId: string;
    memberId: string;
    $router: any;

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
      this.memberId = next.params.id;
    }

    onClose = () => {
      this.$router.navigate(["PharmacyPeopleIdentification", { personId: this.personId }]);
    }

    onChange = () => {
      this.$router.navigate(["PharmacyPeopleIdentificationSelect", { personId: this.personId }]);
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/identification/identification-add.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyPeopleIdentificationAdd", new Component());

}
