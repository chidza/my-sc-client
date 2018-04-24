namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncouterExaminationDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;

  }

  class Controller implements IEncouterExaminationDialog {

    encounterId: string;
    personId: string;
    examination: data.IExamination;
    examinationId: string;
    personExaminationId: string;
    examinationName: string;
    encounterExaminationId: string;

    encounterExamination = {} as data.IEncounterExamination;
    personExamination = {} as data.IPersonExamination;
    datePickerOpenStatus = {};

    public saved: (id: Object) => void;
    public closed: () => void;

    static $inject = ["EncounterExaminationService", "PersonExaminationService", "ExaminationService"
      , "DateUtils", "SiteSettingService", "dialogs"];
    constructor(private encounterExaminationService: data.IEncounterExaminationService,
      private personExaminationService: data.IPersonExaminationService,
      private examinationService: data.IExaminationService,
      private dateUtils: utils.IDateUtils,
      private siteSettingService: data.ISiteSettingService,
      private dialog: ng.dialogservice.IDialogService) {

    }
    $onInit = () => {
      this.encounterExaminationService.get(this.encounterExaminationId).then((response) => {
        this.encounterExamination = response;

        this.personExaminationService.get(response.personExaminationId).then((response) => {
          this.personExamination = response;
          this.getExamination(response.examinationId);
        });
      }, (error) => {
        this.siteSettingService.currentTime().then((response) => {
          this.personExamination = {
            date: this.dateUtils.convertLocalDateTimeFromServer(response.currentTime),
            present: false,
            personId: this.personId,
            examinationId: this.examinationId,
            note: ""
          } as data.IPersonExamination;
        });
        this.getExamination(this.examinationId);
      });
    }

    getExamination(id: string) {
      this.examinationService.get(id).then((response) => {
        this.examination = response;
      });
    }

    close = () => {
      this.closed();
    }

    save = () => {
      if (this.encounterExamination.id) {
        this.personExaminationService.update(this.personExamination).then((response) => {
          this.saved({ id: this.encounterExamination.id });
          console.log("update");
        }, this.saveError);

      } else {
        this.encounterExaminationService.saveEncounterExamination(this.encounterId, this.personExamination).then((response) => {
          this.saved({ id: response.id, personExaminationId: response.personExaminationId });
          console.log("create");
        }, this.saveError);

      }
    }

    saveError = () => {
      this.dialog.error("Save Error", "Examination could not be saved at this time, Try again");
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-examination/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        examinationId: "<",
        encounterExaminationId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsEncounterExaminationDialog", new Component());

}