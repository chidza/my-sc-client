namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleRelationAdd extends ng.IController {

  }

  class Controller implements IPharmacyPeopleRelationAdd {
    personId: string;
    memberId: string;
    $router: any;

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
      this.memberId = next.params.id;
    }

    onClose = () => {
      this.$router.navigate(["PharmacyPeopleRelation", { personId: this.personId }]);
    }

    onChange = () => {
      this.$router.navigate(["PharmacyPeopleRelationSelect", { personId: this.personId }]);
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/relation/relation-add.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyPeopleRelationAdd", new Component());

}
