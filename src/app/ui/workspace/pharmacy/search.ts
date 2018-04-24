namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacySearch extends ng.IController {
    onRegister(): void;
    onSelected(personId: string): void;
  }

  class Controller implements IPharmacySearch {

    personId: string;

    $router: any;

    onRegister = (): void => {
      this.$router.navigate(["PharmacyRegistration"]);
    }

    onSelected = (personId: string): void => {
      this.personId = personId;
    }

    fileManagement = (): void => {
      this.$router.navigate(["PharmacyPeople", { personId: this.personId }, "PharmacyPeopleOverview", { personId: this.personId }]);
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/search.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "$router": "<"
      };

    }
  }

  app.component("mrsPharmacySearch", new Component());

}
