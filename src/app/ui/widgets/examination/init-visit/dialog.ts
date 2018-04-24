namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IInitVisitDialog extends ng.IController {
    closed: () => void;
    saved: (opdId: Object) => void;
  }

  class Controller implements IInitVisitDialog {
    personId: string;
    opd: data.IOpd;

    public saved: (opdId: Object) => void;
    public closed: () => void;


    static $inject = ["OpdService"];
    constructor(private opdService: data.IOpdService) {

    }

    $onInit = () => {
    /* this.opdService.get(1).then((response) => {
        this.opd = response;
      });*/

    }

    save = (): void => {
      this.opd.personId = this.personId;
      this.opd.date = new Date();
      this.opd.closed = false;

      this.onSave(this.opdService.save(this.opd));

    }

    onSave = (promise: ng.IPromise<data.IOpd>) => {
      promise.then((response) => {
        this.opd = response;
        this.saved({ opdId: response.id });
      }, () => {

      });
    }

    close = () => {
      this.closed();
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/init-visit/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "saved": "&",
        "closed": "&",
        "personId": "<"
      };

    }
  }

  app.component("mrsInitVisitDialog", new Component());

}
