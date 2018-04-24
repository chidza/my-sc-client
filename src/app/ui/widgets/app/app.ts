namespace mrs {

  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/widgets/app/app.html",
      public controllerAs = "vm",
      public controller = Controller) {
    }

  }

  app.component("mrsApp", new Component());

}