namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPersonMedicationDialog extends ng.IController {
    closed: () => void;
    saved: (personMedicationId: Object) => void;
  }

  class Controller implements IPersonMedicationDialog {
    personMedicationId: string;
    drugNameId: string;
    drugOptions = [] as Array<data.IDrugOption>;
    drugSuffix = [] as Array<data.IDrugSuffix>;
    drugOptionNames = [] as Array<data.IOptiondrug>;
    personId: string;
    datePickerOpenStatus = {};
    personMedication = {} as data.IPersonMedication;
    drugName = {} as data.IDrugName;
    date: Date;

    public saved: (personMedicationId: Object) => void;
    public closed: () => void;

    static $inject = ["PersonMedicationService", "DrugNameService", "DrugOptionService", "dialogs", "DrugSuffixService"];
    constructor(private personMedicationService: data.IPersonMedicationService,
      private drugNameService: data.IDrugNameService,
      private drugOptionService: data.IDrugOptionService,
      private dialog: ng.dialogservice.IDialogService,
      private drugSuffixService: data.IDrugSuffixService) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }


    init = () => {
      console.log("this herer ");
      console.log(this);
      if (this.drugNameId && this.personMedicationId && this.personId) {
        this.personMedicationService.get(this.personMedicationId).then((response) => {
          this.personMedication = response;
        }, (err) => {
          this.personMedication.drugNameId = this.drugNameId;
          this.personMedication.personId = this.personId;
          if (this.date) {
            this.personMedication.date = new Date(this.date);
          } else {
            this.personMedication.date = new Date();
          }
        });
        this.drugNameService.getDrugName(this.drugNameId).then((response) => {
          this.drugName = response;
        });


        this.drugOptionService.getDrugOptionsByDrugNameId(this.drugNameId).then((response) => {
          this.drugOptions = response;
          this.drugSuffixService.query().then((response) => {
            this.drugSuffix = response;
            this.drugOptions.forEach((drugOption) => {
              this.drugSuffix.forEach((drugSuffix) => {
                if (drugOption.suffixId === drugSuffix.id) {
                  let option = {} as data.IOptiondrug;
                  option.id = drugSuffix.name;
                  option.value = drugOption.id;
                  this.drugOptionNames.push(option);
                }
              });
            });
          });

        });
      }
    }

    openCalendar = (date: string) => {
      if (date) {
        this.datePickerOpenStatus[date] = true;
      }
    }

    close = () => {
      this.closed();
    }

    save = () => {
      if (this.personMedication.id) {
        this.personMedicationService.update(this.personMedication).then((response) => {
          this.saved({ personMedicationId: response.id });
        });
      } else {
        this.personMedicationService.save(this.personMedication).then((response) => {
          this.saved({ personMedicationId: response.id });
        });
      }
    }

  }
  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/person-medication/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        saved: "&",
        closed: "&",
        date: "<",
        drugNameId: "<",
        personId: "<",
        personMedicationId: "<",
      };

    }
  }

  app.component("mrsPersonMedicationDialog", new Component());

}
