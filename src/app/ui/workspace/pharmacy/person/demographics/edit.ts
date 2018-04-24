namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleDemographicsEdit extends ng.IController {

  }

  class Controller implements IPharmacyPeopleDemographicsEdit {

    personId: string;
    $router: any;

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
    }

    close = (personId: string) => {
      this.$router.navigate(["PharmacyPeopleDemographics", { personId: personId }]);
    }

    cancel = () => {
      this.$router.navigate(["PharmacyPeopleDemographics", { personId: this.personId }]);
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/demographics/edit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"

      };

    }
  }

  app.component("mrsPharmacyPeopleDemographicsEdit", new Component());

}
