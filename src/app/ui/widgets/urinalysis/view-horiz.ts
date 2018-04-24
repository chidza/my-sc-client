namespace mrs.ui {
  "use strict";
  let app = angular.module(mrs.appName);
  interface IUrinalysisViewHorizontal extends ng.IController {
  }
  class Controller implements IUrinalysisViewHorizontal {
    personId: string;
    start: string;
    end: string;
    urinalysis: data.IUrinalysisView;
    static $inject = ["PersonInvestigationService"];
    constructor(private personInvestigationService: data.IPersonInvestigationService
    ) {
    }
    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }
    init = () => {
      if (this.personId && this.start) {
        this.personInvestigationService.getPartogramUrinalysis(this.personId, this.start, this.end).then((response) => {
          this.urinalysis = response;
        });
      }
    }
  }
  class Component implements ng.IComponentOptions {
    bindings: { [binding: string]: string };
    constructor(
      public templateUrl = "app/ui/widgets/urinalysis/view-horiz.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        start: "<",
        end: "<"
      };
    }
  }
  app.component("mrsUrinalysisView", new Component());
}