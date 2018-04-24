namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleRelation extends ng.IController {

  }

  class Controller implements IPharmacyPeopleRelation {
    personId: string;
    $router: any;

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
    }

    onAdd = () => {
      this.$router.navigate(["PharmacyPeopleRelationSelect", { personId: this.personId }]);
    }

    onEdit = (id: string) => {
      this.$router.navigate(["PharmacyPeopleRelationEdit", { personId: this.personId, id: id }]);
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/relation/relation.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyPeopleRelation", new Component());

}
