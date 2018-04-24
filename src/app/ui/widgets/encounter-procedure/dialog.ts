namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterProcedureDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;
  }

  class Controller implements IEncounterProcedureDialog {

    encounterId: string;
    personId: string;
    procedureId: string;
    personProcedure = {} as data.IPersonProcedure;
    encounterProcedure = {} as data.IEncounterProcedure;
    encounterProcedureId: string;
    personProcedureId: string;
    procedureName: string;
    procedure: data.IMedicalProcedure;
    isSaving: boolean;

    public saved: (id: Object) => void;

    public closed: () => void;

    static $inject = ["EncounterProcedureService", "PersonProcedureService", "MedicalProcedureService", "SiteSettingService", "DateUtils", "dialogs"];
    constructor(private encounterProcedureService: data.IEncounterProcedureService,
      private personProcedureService: data.IPersonProcedureService,
      private medicalProcedureService: data.IMedicalProcedureService,
      private siteSettingService: data.ISiteSettingService,
      private dateUtils: utils.IDateUtils,
      private dialog: ng.dialogservice.IDialogService) {

    }

    $onInit = () => {
      this.encounterProcedureService.get(this.encounterProcedureId).then((response) => {
        this.encounterProcedure = response;

        this.personProcedureService.get(response.personProcedureId).then((response) => {
          this.personProcedure = response;
          this.getProcedure(response.procedureId);
        });

      }, (error) => {
        this.siteSettingService.currentTime().then((response) => {

          this.encounterProcedure = {} as data.IEncounterProcedure;

          this.personProcedure = {
            procedureId: this.procedureId,
            date: this.dateUtils.convertLocalDateFromServer(response.currentTime),
            personId: this.personId,
            note: ""

          } as data.IPersonProcedure;

        });
      });
      this.getProcedure(this.procedureId);

    }

    getProcedure = (id: string) => {
      this.medicalProcedureService.get(id).then((response) => {
        this.procedure = response;
      });
    }

    close = () => {
      this.closed();
    }

    save = () => {
      this.isSaving = true;
      if (this.encounterProcedure.id) {
        this.personProcedureService.update(this.personProcedure).then((response) => {
          this.saved({ id: this.encounterProcedure.id });
        }, this.saveError);

      } else {
        this.encounterProcedureService.saveEncounterProcedure(this.encounterId, this.personProcedure).then((response) => {
          this.saved({ id: response.id });

        }, this.saveError);

      }

    }
    saveError = () => {
      this.isSaving = false;
      this.dialog.error("Save Error", "Procedure could not be save at this time. Please try again");
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-procedure/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        medicalProcedureId: "<",
        procedureId: "<",
        encounterProcedureId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsEncounterProcedureDialog", new Component());

}
