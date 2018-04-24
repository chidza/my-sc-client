namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterInvestigationDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;


  }

  class Controller implements IEncounterInvestigationDialog {
    encounterId: string;
    personId: string;
    personInnvestigation = {} as data.IPersonProcedure;
    encounterInvestigation = {} as data.IEncounterInvestigation;
    investigationId: string;
    personInvestigation = {} as data.IPersonInvestigation;
    sampleName: string;
    testName: string;
    encounterInvestigationId: string;

    public saved: (id: Object) => void;

    public closed: () => void;

    datePickerOpenStatus = {};


    static $inject = ["EncounterInvestigationService", "InvestigationService", "SampleService", "LabTestService", "PersonInvestigationService", "SiteSettingService", "DateUtils", "dialogs"];
    constructor(
      private encounterInvestigationService: data.IEncounterInvestigationService,
      private investigationService: data.IInvestigationService,
      private sampleService: data.ISampleService,
      private labTestService: data.ILabTestService,
      private personInvestigationService: data.IPersonInvestigationService,
      private siteSettingService: data.ISiteSettingService,
      private dateUtils: utils.IDateUtils,
      private dialog: ng.dialogservice.IDialogService) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }



    init = () => {
      console.log("here here here ",this);

      this.encounterInvestigationService.get(this.encounterInvestigationId).then((response) => {
        this.encounterInvestigation = response;

        this.personInvestigationService.get(response.personInvestigationId).then((response) => {
          this.personInvestigation = response;

          this.investigationService.get(this.personInvestigation.investigationId).then((response) => {
            this.getInvestigation(response);
          });
        });

      }, (error) => {
        this.siteSettingService.currentTime().then((response) => {

          this.encounterInvestigation = {} as data.IEncounterInvestigation;

          this.personInvestigation = {
            date: this.dateUtils.convertLocalDateFromServer(response.currentTime),
            personId: this.personId,
            investigationId: this.investigationId

          } as data.IPersonInvestigation;

        });
      });
      this.investigationService.get(this.investigationId).then((response) => {
        this.getInvestigation(response);
      });

    }

    getInvestigation = (response: data.IInvestigation) => {
      this.sampleService.get(response.sampleId).then((response) => {
        this.sampleName = response.name;
      });

      this.labTestService.get(response.testId).then((response) => {
        this.testName = response.name;
      });
    }

    save = () => {

      if (this.personInvestigation.id !== "") {
        this.personInvestigationService.update(this.personInvestigation).then((response) => {
          this.saved({ personInvestigationId: response.id });
        });
      }
      else {
        console.log(this.personInvestigation);
        this.onSave(this.encounterInvestigationService.saveEncounterInvestigation(this.encounterId, this.personInvestigation));

      }
    }

    openCalendar = (date: string) => {
      this.datePickerOpenStatus[date] = true;
    }

    close = () => {
      this.closed();
    }

    onSave = (promise: ng.IPromise<data.IEncounterInvestigation>) => {
      promise.then((response) => {
        this.saved({ personInvestigationId: response.personInvestigationId });

      }, () => {
        console.log("save error");
      });
    }



  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-investigation/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        investigationId: "<",
        personInvestigationId: "<",
        saved: "&",
        closed: "&",

      };

    }
  }

  app.component("mrsEncounterInvestigationDialog", new Component());

}
