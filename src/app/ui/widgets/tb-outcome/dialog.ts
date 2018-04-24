
namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ITbOutcomeDialog extends ng.IController {
    closed: () => void;
    saved: () => void;
  }

  class Controller implements ITbOutcomeDialog {
    encounterId: string;
    personId: string;
    tbId: string;
    tb: data.ITb;
    tbOutcomes: Array<String> = ["CURRENT", "FAILED", "LOST_TO_FOLLOW", "CURED", "COMPLETED", "TRANSFERED", "DIED"];

    public saved: () => void;

    public closed: () => void;

    static $inject = ["TbService"];
    constructor(private tbService: data.ITbService

    ) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      if (this.tbId) {
        this.tbService.get(this.tbId).then((response) => {
          this.tb = response;
          console.log(response);
        }, (error) => {
          console.log("error retriving tb record");
        });

      }


    }

    save = () => {
      this.tbService.update(this.tb).then((response) => {
        this.saved();
      });
    }

    close = () => {
      this.closed();
    }

    onSave = (promise: ng.IPromise<data.IHts>) => {
      promise.then((response) => {
        if (this.saved != null) {
          this.saved();
        }
      }, () => {

      });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/tb-outcome/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        tbId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsTbOutcomeDialog", new Component());

}
