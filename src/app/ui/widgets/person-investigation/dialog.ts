namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPersonInvestigationDialog extends ng.IController {
    closed: () => void;
    saved: (personInvestigationId: Object) => void;
  }

  class Controller implements IPersonInvestigationDialog {
    datePickerOpenStatus = {};
    investigationId: string;
    personId: string;
    personInvestigationId: string;
    personInvestigation = {} as data.IPersonInvestigation;
    investigation: data.IInvestigation;
    sample: data.ISample;
    labTest: data.ILabTest;
    investigationResults: Array<data.IResult> = [];
    date: Date;
    disableResult: boolean = false;
    public saved: (personInvestigationId: Object) => void;
    public closed: () => void;

    static $inject = ["PersonInvestigationService", "InvestigationService", "SampleService", "LabTestService",
      "InvestigationResultService", "SiteSettingService"];
    constructor(private personInvestigationService: data.IPersonInvestigationService,
      private investigationService: data.IInvestigationService,
      private sampleService: data.ISampleService,
      private labTestService: data.ILabTestService,
      private investigationResultService: data.IInvestigationResultService,
      private siteSettingService: data.ISiteSettingService) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {
        this.personInvestigationService.get(this.personInvestigationId).then((response) => {
          this.personInvestigation = response;
          this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.HIV_TEST_ID).then((response) => {
            if (this.investigationId === response.value) {
              this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.POSITIVE_RESULT_ID).then((response) => {
                if (this.personInvestigation.result === response.value) {
                  this.disableResult = true;
                }
              });

            }
          });
        }, (err) => {
          if (this.date) {
            this.personInvestigation.date = new Date(this.date);
          } else {
            this.personInvestigation.date = new Date();
          }

          this.personInvestigation.personId = this.personId;
          this.personInvestigation.issueDate = this.personInvestigation.date;
          this.personInvestigation.investigationId = this.investigationId;
        });
      if (this.investigationId && this.personId) {
        this.investigationService.get(this.investigationId).then((response) => {
          this.investigation = response;
          this.sampleService.get(response.sampleId).then((response) => {
            this.sample = response;
          });
          this.labTestService.get(response.testId).then((response) => {
            this.labTest = response;
          });
        });
        this.investigationResultService.getResultByInvestigationId(this.investigationId).then((response) => {
          this.investigationResults = response;
        });

      }
    }

    openCalendar = (date: string) => {
      if (date) {
        this.datePickerOpenStatus[date] = true;
      }
    }

    save = () => {
      if (this.personInvestigation.id) {
        this.onSave(this.personInvestigationService.update(this.personInvestigation));
      } else {
        this.onSave(this.personInvestigationService.save(this.personInvestigation));
      }
    }

    close = () => {
      this.closed();
    }

    onSave = (promise: ng.IPromise<data.IPersonInvestigation>) => {
      promise.then((response) => {
        if (this.saved != null) {
          this.saved({ personInvestigationId: response.id });
        }
      }, () => {

      });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/person-investigation/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        investigationId: "<",
        personId: "<",
        personInvestigationId: "<",
        date: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsPersonInvestigationDialog", new Component());

}
