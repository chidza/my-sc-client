namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IUrinalysisView extends ng.IController {
  }

  class Controller implements IUrinalysisView {

    deliveryId: string;
    start: string;
    end: string;
    urinalysis: Array<data.IUrinalysis> = [];
    static $inject = ["PersonInvestigationService"];
    constructor(private personInvestigationService: data.IPersonInvestigationService
    ) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {
      if (this.deliveryId && this.start) {
        this.personInvestigationService.getUrinalysisView(this.deliveryId, this.start, this.end).then((response) => {
          this.urinalysis = response;
        });
      }

    }

  }
  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/urinalysis/view.html",

      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        deliveryId: "<",
        start: "<",
        end: "<",
        width: "<"
      };

    }
  }

  app.component("mrsUrinalysisViewVertical", new Component());

}
