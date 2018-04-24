namespace mrs.ui {
  "use strict";
  let app = angular.module(mrs.appName);
  interface IDispenseDialog extends ng.IController {
    closed: () => void;
    saved: (dispenseId: Object) => void;
  }
  class Controller implements IDispenseDialog {
    date: string;
    encounterId: string;
    frequencyId: string;
    dispenseId: string;
    personId: string;
    dispense = {} as data.IDispense;
    datePickerOpenStatus = {};
    drug: data.IDrugName;
    stock: data.IDrug;
    drugId: string;
    drugOptions = [] as Array<data.IDrugOption>;
    drugSuffix = [] as Array<data.IDrugSuffix>;
    drugOptionNames = [] as Array<data.IOptiondrug>;
    frequencies: Array<data.IFrequency> = [];
    formulation: data.IFormulation;
    unit: data.IUnit;
    batches: Array<data.IDrugBatch> = [];
    batchExpiryDate: Date;
    personMedication = {} as data.IPersonMedication;
    public closed: () => void;
    public saved: (dispenseId: Object) => void;
    static $inject = ["DispenseService", "DrugNameService", "DrugService", "FrequencyService",
      "DrugOptionService", "DrugSuffixService", "FormulationService", "UnitService",
      "DrugBatchService", "PersonMedicationService", "EncounterMedicationService"];
    constructor(private dispenseService: data.IDispenseService,
      private drugNameService: data.IDrugNameService,
      private drugService: data.IDrugService,
      private frequencyService: data.IFrequencyService,
      private drugOptionService: data.IDrugOptionService,
      private drugSuffixService: data.IDrugSuffixService,
      private formulationService: data.IFormulationService,
      private unitService: data.IUnitService,
      private drugBatchService: data.IDrugBatchService,
      private personMedicationService: data.IPersonMedicationService,
      private encounterMedicationService: data.IEncounterMedicationService) {
    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }
    init = () => {
      if (this.drugId) {
        this.drugService.get(this.drugId).then((response) => {
          this.stock = response;
          this.dispenseService.get(this.dispenseId).then((response) => {
            this.dispense = response;
            this.personMedicationService.get(this.dispense.personMedicationId).then((response) => {
              this.personMedication = response;
            });
            this.getExpiryDate();
          }, (error) => {
            this.personMedication.drugNameId = this.stock.drugNameId;
            this.personMedication.date = new Date(moment(this.date));
            this.personMedication.personId = this.personId;
            this.dispense.date = new Date(moment(this.date));
            this.dispense.frequencyId = this.frequencyId;
            this.dispense.drugId = this.drugId;
          });
          this.formulationService.get(response.formulationId).then((response) => {
            this.formulation = response;
          });
          this.unitService.get(response.unitId).then((response) => {
            this.unit = response;
          });
          this.drugNameService.get(response.drugNameId).then((response) => {
            this.drug = response;
            this.drugOptionService.getDrugOptionsByDrugNameId(this.drug.id).then((response) => {
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
          });
        });
        this.frequencyService.query().then((response) => {
          this.frequencies = response;
        });
        this.drugBatchService.getByDrugId(this.drugId).then((response) => {
          this.batches = response;
        });
      }
    }
    getExpiryDate = () => {
      if (this.batches) {
        this.batches.forEach((batch) => {
          if (batch.id === this.dispense.batchId) {
            this.batchExpiryDate = batch.expiryDate;
          }
        });
      }
    }
    save = () => {
      if (this.dispense.id) {
        this.personMedicationService.update(this.personMedication).then((response) => {
          this.onSave(this.dispenseService.update(this.dispense));
        });
      }
      else {
        if (this.encounterId) {
          this.encounterMedicationService.saveEncounterMedication(this.encounterId, this.personMedication).then((response) => {
            this.dispense.personMedicationId = response.personMedicationId;
            this.onSave(this.dispenseService.save(this.dispense));
          });
        }

      }
    }
    onSave = (promise: ng.IPromise<data.IDispense>) => {
      promise.then((response) => {
        if (this.saved != null) {
          this.saved({ dispenseId: response.id });
        }
      }, (error) => {
        console.log(error);
      });
    }
    openCalendar = (date: string) => {
      this.datePickerOpenStatus[date] = true;
    }
    close = () => {
      if (this.closed() != null) {
        this.closed();
      }
    }
  }
  class Component implements ng.IComponentOptions {
    bindings: { [binding: string]: string };
    constructor(
      public templateUrl = "app/ui/widgets/dispense/encounter-dispense.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        dispenseId: "<",
        drugId: "<",
        personId: "<",
        encounterId: "<",
        date: "<",
        saved: "&",
        closed: "&"
      };
    }
  }
  app.component("mrsEncounterDispenseDialog", new Component());
}