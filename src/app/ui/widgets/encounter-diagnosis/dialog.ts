namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterDiagnosisDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;
  }

  interface IChangesParams extends ng.IOnChangesObject {
    diagnosisId: ng.IChangesObject<string>;
    encounterId: ng.IChangesObject<string>;
    personDiagnosisId: ng.IChangesObject<string>;
    personId: ng.IChangesObject<string>;
  }
  class Controller implements IEncounterDiagnosisDialog {
    encounterId: string;
    personId: string;
    diagnosisId: string;
    personDiagnosis = {} as data.IPersonDiagnosis;
    encounterDiagnosis = {} as data.IEncounterDiagnosis;
    diagnosis: data.IDiagnosis;
    encounterDiagnosisId: string;
    diagnosisName: string;
    isSaving: boolean;


    public saved: (id: Object) => void;
    public closed: () => void;



    static $inject = ["dialogs", "EncounterDiagnosisService", "PersonDiagnosisService", "DiagnosisService", "SiteSettingService", "DateUtils"];
    constructor(private dialog: ng.dialogservice.IDialogService,
      private encounterDiagnosisService: data.IEncounterDiagnosisService,
      private personDiagnosisService: data.IPersonDiagnosisService,
      private diagnosisService: data.IDiagnosisService,
      private siteSettingService: data.ISiteSettingService,
      private dateUtils: utils.IDateUtils,
    ) {

    }

    $onInit = () => {
      this.encounterDiagnosisService.get(this.encounterDiagnosisId).then((response) => {
        this.encounterDiagnosis = response;
        this.personDiagnosisService.get(response.personDiagnosisId).then((response) => {
          this.personDiagnosis = response;

          this.getDiagnosisName(response.diagnosisId);
        });
      }, (error) => {
        this.siteSettingService.currentTime().then((response) => {
          this.personDiagnosis = {
            date: this.dateUtils.convertLocalDateFromServer(response.currentTime),
            definitive: false,
            diagnosisId: this.diagnosisId,
            differential: false,
            finalDiagnosis: false,
            personId: this.personId,
            working: false

          } as data.IPersonDiagnosis;

        });
      });

      this.getDiagnosisName(this.diagnosisId);

    }

    getDiagnosisName = (diagnosisId: string) => {
      this.diagnosisService.get(diagnosisId).then((response) => {
        this.diagnosis = response;
      });
    }

    save = () => {
      this.isSaving = true;

      if (this.encounterDiagnosis.id) {
        this.personDiagnosisService.update(this.personDiagnosis).then((response) => {
          this.saved({ id: this.encounterDiagnosis.id });
        }, this.saveError);
      } else {
        this.encounterDiagnosisService.saveEncounterDiagnosis(this.encounterId, this.personDiagnosis).then((response) => {
          this.saved({ id: response.id });
        }, this.saveError);

      }

    }

    saveError = () => {
      this.dialog.error("Save Error", "Diagnosis could not be saved. Try again");
    }

    close = () => {
      this.closed();
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-diagnosis/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        diagnosisId: "<",
        encounterDiagnosisId: "<",
        saved: "&",
        closed: "&"

      };

    }
  }

  app.component("mrsEncounterDiagnosisDialog", new Component());

}