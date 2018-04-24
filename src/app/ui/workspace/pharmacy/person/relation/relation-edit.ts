namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleRelationEdit extends ng.IController {

  }

  class Controller implements IPharmacyPeopleRelationEdit {
    personId: string;
    personRelationId: string;
    memberId: string;
    $router: any;
    static $inject = ["RelationService"];
    constructor(private relationService: data.IRelationService) {

    }

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
      this.personRelationId = next.params.id;
      this.relationService.get(this.personRelationId).then((response) => {
        this.memberId = response.memberId;
      });
    }
    onClose = () => {
      this.$router.navigate(["PharmacyPeopleRelation", { personId: this.personId }]);
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/relation/relation-edit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyPeopleRelationEdit", new Component());

}
