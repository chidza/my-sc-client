namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ITemplateDialog extends ng.IController {

  }

  class Controller implements ITemplateDialog {

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/template/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {

      };

    }
  }

  app.component("mrsTemplateDialog", new Component());

}
