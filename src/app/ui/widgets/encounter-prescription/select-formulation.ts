namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ISelectFormulation extends ng.IController {
    selectMedicationFormulation: (formulationId: Object) => void;
  }

  class Controller implements ISelectFormulation {

    drugNameId: string;
    drugs: Array<data.IDrugList>;
    drugName: data.IDrugName;
    formulationId: string;

    public selectMedicationFormulation: (formulationId: Object) => void;

    static $inject = ["DrugService", "DrugNameService"];
    constructor(private drugService: data.IDrugService, private drugNameService: data.IDrugNameService) {
    }

    $onChanges = (obj: ng.IOnChangesObject): void => {

      if (this.drugNameId) {
        this.drugNameService.get(this.drugNameId).then((response) => {

          this.drugName = response;

          this.drugService.getDrugs(response.id).then((response) => {
            this.drugs = response;

          }, (error) => {
            this.clear();
          });

        }, () => {
          this.clear();
        });

      } else {
        this.clear();
      }
    }

    clear = () => {
      this.drugName={} as data.IDrugName;
      this.drugs = [];
    }

    selected = (id: string) => {
      this.formulationId = id;
    }

    onSelected = () => {
      if (this.formulationId) {
        this.selectMedicationFormulation({ formulationId: this.formulationId });
      }
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-prescription/select-formulation.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        drugNameId: "<",
        "selectMedicationFormulation": "&"
      };

    }
  }

  app.component("mrsSelectFormulation", new Component());

}
