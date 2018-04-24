namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {

    // static $inject = ["PersonService"];
    constructor() {

    }

    $routerOnActivate = (next: any): void => {

    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/warehouse/overview/overview.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
      };
    }

  }

  app.component("mrsWarehouseOverview", new Component());

}
