namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleOverview extends ng.IController {

  }

  class Controller implements IPharmacyPeopleOverview {
    personId: string;

    person: data.IPerson;

    $router: any;

    static $inject = ["PersonService"];
    constructor(private personService: data.IPersonService) {

    }

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;

      this.personService.get(this.personId).then((response) => {
        this.person = response;
      });

    }

    dispense = () => {
      // absolute sando: well known route so its fine
      this.$router.parent.navigate(["PharmacyDispense", { personId: this.person.id }, "PharmacyDispenseOverview", { personId: this.person.id }]);
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/overview/overview.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyPeopleOverview", new Component());

}
