namespace mrs.ui {
  "use strict";
  let app = angular.module(mrs.appName);
  interface IViewOxytoxinGivenDuringLabour extends ng.IController {
  }
  class Controller implements IViewOxytoxinGivenDuringLabour {
    deliveryId: string;
    from: string;
    to: string;
    width: number;

    data: Array<data.IOxytocinView> = [];
    static $inject = ["PersonMedicationService"];
    constructor(private personMedicationService: data.IPersonMedicationService
    ) {
    }
    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }
    init = () => {

      if (this.deliveryId && this.from) {

        this.personMedicationService.getOxytocinGivenInLabour(this.deliveryId, this.from, this.to).then((response) => {
          this.data = response;

        });
      }
    }
  }
  class Component implements ng.IComponentOptions {
    bindings: { [binding: string]: string };
    constructor(
      public templateUrl = "app/ui/widgets/oxytocin-given-epartograph/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        deliveryId: "<",
        from: "<",
        to: "<",
        width: "<"
      };
    }
  }
  app.component("mrsOxytocinList", new Component());
}