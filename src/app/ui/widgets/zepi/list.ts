namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IListVaccinationDialog extends ng.IController {

    addMedication: () => void;
    editMedication: (medicationId: Object) => void;
  }

  class Controller implements IListVaccinationDialog {

    zepiList = [] as Array<data.IPersonZepiList>;
    personId: string;
    drugName: Array<data.IDrugName>;

    zepiLists: Array<data.IZepi> = [];
    suffix: Array<data.IDrugSuffix>;

    public addMedication: () => void;
    public editMedication: (personMedicationId: Object) => void;



    static $inject = ["PersonMedicationService", "DrugOptionService", "DrugNameService", "DrugSuffixService", "dialogs"];
    constructor(private personMedicationService: data.IPersonMedicationService,
      private drugOptionService: data.IDrugOptionService,
      private drugNameService: data.IDrugNameService,
      private drugSuffixService: data.IDrugSuffixService,
      private dialog: ng.dialogservice.IDialogService) {

    }

    $onInit = () => {
      this.init();
    }

    init = () => {

      this.personMedicationService.getByZepi(this.personId).then((response) => {
        this.zepiList = response;
      });

    }

    add = () => {
      this.addMedication();
    }

    edit = (item: data.IPersonZepiList) => {
      this.editMedication({ personMedicationId: item.id, dispenseId: item.dispenseId });
    }



  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/zepi/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "addMedication": "&",
        "editMedication": "&",
        personId: "<"
      };

    }
  }

  app.component("mrsListVaccinationDialog", new Component());

}
