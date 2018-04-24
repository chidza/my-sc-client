namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterPrescriptionDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;
  }

  class Controller implements IEncounterPrescriptionDialog {
    encounterId: string;
    personId: string;
    prescription = {} as data.IPrescription;
    medicationId: string;
    frequencies: Array<data.IFrequency>;
    prescriptionId: string;
    drug = {} as data.IDrug;
    drugName = {} as data.IDrugName;

    public saved: (id: Object) => void;
    public closed: () => void;

    static $inject = ["PrescriptionService", "FrequencyService", "DrugService", "DrugNameService"
      , "DateUtils", "SiteSettingService"];
    constructor(private prescriptionService: data.IPrescriptionService
      , private frequencyService: data.IFrequencyService,
      private drugService: data.IDrugService,
      private drugNameService: data.IDrugNameService,
      private dateUtils: utils.IDateUtils,
      private siteSettingService: data.ISiteSettingService) {
    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
    }

    $onInit = () => {
      this.frequencyService.query().then((response) => {
        this.frequencies = response;

        this.prescriptionService.get(this.prescriptionId).then((response) => {
          this.prescription = response;

          this.drugService.get(this.prescription.drugId).then((response) => {
            this.drug = response;
            this.drugNameService.get(this.drug.drugNameId).then((response) => {
              this.drugName = response;
            });
          });
        }, (error) => {
          this.siteSettingService.currentTime().then((response) => {
            this.prescription.date = this.dateUtils.convertLocalDateTimeFromServer(response.currentTime);
            this.prescription.drugId = this.medicationId;
            this.prescription.encounterId = this.encounterId;
          });

        });

      });
      if (this.medicationId) {
        this.drugService.get(this.medicationId).then((response) => {
          this.drug = response;
          this.drugNameService.get(this.drug.drugNameId).then((response) => {
            this.drugName = response;
          });

        });
      }


    }

    close = () => {
      this.closed();
    }

    save = () => {
      if (this.prescription.id) {
        this.prescriptionService.update(this.prescription).then((response) => {
          this.saved({ presciptionId: response.id });

        }, (error) => {
        });
      } else {
        this.prescriptionService.save(this.prescription).then((response) => {
          this.saved({ presciptionId: response.id});
        }, (error) => {
        });

      }
    }

  }


  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-prescription/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        medicationId: "<",
        prescriptionId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsPrescriptionDialog", new Component());

}
