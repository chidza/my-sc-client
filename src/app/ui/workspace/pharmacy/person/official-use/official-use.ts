namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleOfficialUse extends ng.IController {

  }

  class Controller implements IPharmacyPeopleOfficialUse {

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/official-use/official-use.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {

      };

    }
  }

  app.component("mrsPharmacyPeopleOfficialUse", new Component());

}
