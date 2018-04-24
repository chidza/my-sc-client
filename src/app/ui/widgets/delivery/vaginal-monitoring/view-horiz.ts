namespace mrs.ui {
  "use strict";
  let app = angular.module(mrs.appName);
  interface IVaginalViewHorizontal extends ng.IController {
  }
  class Controller implements IVaginalViewHorizontal {
    deliveryId: string;
    start: string;
    end: string;
    data: data.IPartogramView;
    static $inject = ["VaginalMonitoringService"];
    constructor(private vaginalMonitoringService: data.IVaginalMonitoringService
    ) {
    }
    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }
    init = () => {
      if (this.deliveryId && this.start) {
        this.vaginalMonitoringService.getPartogramView(this.deliveryId, this.start, this.end).then((response) => {
          this.data = response;
        });
      }
    }
  }
  class Component implements ng.IComponentOptions {
    bindings: { [binding: string]: string };
    constructor(
      public templateUrl = "app/ui/widgets/delivery/vaginal-monitoring/view-horiz.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        deliveryId: "<",
        start: "<",
        end: "<"
      };
    }
  }
  app.component("mrsVaginalView", new Component());
}