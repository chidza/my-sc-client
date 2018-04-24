namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ISelectAddDialog extends ng.IController {
    selectMedicationFormulation: (medicationId: Object) => void;
    closed: () => void;
  }

  class Controller implements ISelectAddDialog {
    public selectMedicationFormulation: (medicationId: Object) => void;
    public closed: () => void;
    drugNameId: string;
    $router: any;
    encounterId: string;
    personId: string;

    onDrugNameSelected = (medicationId: string) => {
      this.drugNameId = medicationId;

    }

    $routerOnActivate = (next: any): void => {
      this.encounterId = next.params.encounterId;
      this.personId = next.params.personId;
    }

    select = (id: string) => {
      this.selectMedicationFormulation({ medicationId: id });
    }

    close = () => {
      console.log("close called")
      this.closed();
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-prescription/select-add.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        selectMedicationFormulation: "&",
        closed: "&",
        $router: "<"

      };

    }
  }

  app.component("mrsSelectAddDialog", new Component());

}
