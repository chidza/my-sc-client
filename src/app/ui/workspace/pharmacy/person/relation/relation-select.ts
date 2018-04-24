namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleRelationSelect extends ng.IController {

  }

  class Controller implements IPharmacyPeopleRelationSelect {
    personId: string;
    $router: any;

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
    }

    onSelect = (id: string) => {
      this.$router.navigate(["PharmacyPeopleRelationAdd", { personId: this.personId, id: id }]);
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/relation/relation-select.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyPeopleRelationSelect", new Component());

}
