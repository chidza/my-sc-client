namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPreviousPregnancyDialog extends ng.IController {
    outcome: (outcome: Object) => void;
  }

  class Controller implements IPreviousPregnancyDialog {
    public outcome: (outcome: Object) => void;

    birthOutcome: string;
    currentOutcome: null;

    static $inject = ["AncService", "DeliveryTypeService", "DeliveryService"];
    constructor(private ancService: data.IAncService,
      private deliveryTypesService: data.IDeliveryTypeService,
      private deliveryService: data.IDeliveryService
    ) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.birthOutcome = this.currentOutcome;
    }

    selected = () => {
      this.outcome({ outcome: this.birthOutcome });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/previous-pregnancy/birth-outcome.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        outcome: "&",
        currentOutcome: "<"
      };

    }
  }

  app.component("mrsBirthOutcomeDialog", new Component());

}
