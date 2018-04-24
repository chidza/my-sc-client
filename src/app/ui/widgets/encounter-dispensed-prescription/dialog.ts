namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterPrescriptionDispenseDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;
  }

  interface IChangesParams extends ng.IOnChangesObject {
    medicationId: ng.IChangesObject<string>;
    encounterId: ng.IChangesObject<string>;
    personMedicationId: ng.IChangesObject<string>;
    personId: ng.IChangesObject<string>;
  }

  class Controller implements IEncounterPrescriptionDispenseDialog {
    encounterId: string;
    personId: string;
    medicationId: string;
    frequencies: Array<data.IFrequency>;
    drug = {} as data.IDrug;
    drugName = {} as data.IDrugName;
    personMedication = {} as data.IPersonMedication;
    encounterMedicaiton = {} as data.IEncounterMedication;
    encounterMedicationId: string;
    dispense = {} as data.IDispense;
    isSaving: boolean;

    public saved: (id: Object) => void;
    public closed: () => void;

    static $inject = ["dialogs", "FrequencyService", "DrugService", "DrugNameService"
      , "DateUtils", "SiteSettingService", "EncounterMedicationService", "PersonMedicationService", "DispenseService"];
    constructor(private dialog: ng.dialogservice.IDialogService,
      private frequencyService: data.IFrequencyService,
      private drugService: data.IDrugService,
      private drugNameService: data.IDrugNameService,
      private dateUtils: utils.IDateUtils,
      private siteSettingService: data.ISiteSettingService,
      private encounterMedicationService: data.IEncounterMedicationService,
      private personMedicationService: data.IPersonMedicationService,
      private dispenseService: data.IDispenseService) {
    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
    }

    $onInit = () => {

      this.frequencyService.query().then((response) => {
        this.frequencies = response;

        this.encounterMedicationService.get(this.encounterMedicationId).then((response) => {
          this.encounterMedicaiton = response;

          this.personMedicationService.get(response.personMedicationId).then((response) => {
            this.personMedication = response;

            this.dispenseService.getByPersonMedicationId(this.personMedication.id).then((response) => {
              this.dispense = response;
            });

            this.getMedicationName(response.drugNameId);
          });

        }, (error) => {
          this.siteSettingService.currentTime().then((time) => {
            let ct = time.currentTime;
            const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());

            this.drugService.get(this.medicationId).then((response) => {
              this.drug = response;

              this.getMedicationName(this.drug.drugNameId);

              this.personMedication = {
                date: new Date(myDate),
                personId: this.personId,
                drugNameId: this.drug.drugNameId,

              } as data.IPersonMedication;
            });



            this.dispense = {
              date: new Date(myDate),
              drugId: this.medicationId,
              batchId: null
            } as data.IDispense;
          });

        });

      });

    }

    getMedicationName = (medicationId: string) => {
      this.drugNameService.get(medicationId).then((response) => {
        this.drugName = response;
      });
    }

    close = () => {
      this.closed();
    }

    save = () => {
      this.isSaving = true;

      if (this.encounterMedicaiton.id) {
        this.personMedicationService.update(this.personMedication).then((response) => {
          this.dispenseService.update(this.dispense).then((response) => {

          });
          this.saved({ id: this.encounterMedicaiton.id });
        }, this.saveError);
      } else {
        this.encounterMedicationService.saveEncounterMedication(this.encounterId, this.personMedication).then((response) => {

          this.dispense.personMedicationId = response.personMedicationId;

          this.dispenseService.save(this.dispense).then((response) => {

          });
          this.saved({ id: response.id, personMedicationId: response.personMedicationId });
        }, this.saveError);

      }

    }

    saveError = () => {
      this.dialog.error("Save Error", "Medication could not be saved. Try again");
    }

  }


  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-dispensed-prescription/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        medicationId: "<",
        encounterMedicationId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsPrescriptionDispenseDialog", new Component());

}
