namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IDashboard extends ng.IController {

  }
  class Controller implements IDashboard {

  }
  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/dashboard/dashboard.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {

      };

    }
  }

  app.component("mrsDashboardLayout", new Component());

}
