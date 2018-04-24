namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterHealthEducationDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;
  }

  class Controller implements IEncounterHealthEducationDialog {
    encounterId: string;
    personId: string;
    healthEducationId: string;

    encounterHealthEducation = {} as data.IEncounterHealthEducation;
    personHealthEducation = {} as data.IPersonHealthEducation;
    healthEducationTopicId: string;
    encounterHealthEducationId: string;
    educationTypes: Array<string> = ["GROUP", "INDIVIDUAL"];
    healthEducation: data.IHealthEducationTopic;
    isSaving: boolean;
    public saved: (id: Object) => void;
    public closed: () => void;

    static $inject = ["EncounterHealthEducationService", "PersonHealthEducationService",
      "HealthEducationTopicService", "SiteSettingService", "DateUtils", "dialogs"];
    constructor(private encounterHealthEducationService: data.IEncounterHealthEducationService,
      private personHealthEducationService: data.IPersonHealthEducationService,
      private healthEducationTopicService: data.IHealthEducationTopicService,
      private siteSettingService: data.ISiteSettingService,
      private dateUtils: utils.IDateUtils,
      private dialog: ng.dialogservice.IDialogService) { }

    $onInit = () => {

      this.healthEducationTopicService.get(this.healthEducationTopicId).then((response) => {

        this.healthEducation = response;
      });

      this.healthEducationTopicService.get(this.healthEducationTopicId).then((response) => {

        this.healthEducation = response;
      });

      this.encounterHealthEducationService.get(this.encounterHealthEducationId).then((response) => {
        this.encounterHealthEducation = response;

        this.personHealthEducationService.get(response.personHealthEducationId).then((response) => {
          this.personHealthEducation = response;

          this.getHealthEducation(response.healthEducationTopicId);

        });

      }, (error) => {

        this.siteSettingService.currentTime().then((response) => {

          this.personHealthEducation = {
            healthEducationTopicId: this.healthEducationTopicId,
            date: this.dateUtils.convertLocalDateTimeFromServer(response.currentTime),
            personId: this.personId,

          } as data.IPersonHealthEducation;

          this.getHealthEducation(this.healthEducationTopicId);

        });

      });
    }

    getHealthEducation = (id: string) => {
      this.healthEducationTopicService.get(id).then((response) => {
        console.log("response");
        console.log(response);
        this.healthEducation = response;
      });
    }

    getHealthEducationName = (id: string): string => {
      this.healthEducationTopicService.get(id).then((response) => {
        console.log("response");
        console.log(response);
        this.healthEducation = response;
      });

      return this.healthEducation.name;
    }

    close = () => {
      this.closed();
    }

    save = () => {

      this.isSaving = true;
      if (this.encounterHealthEducation.id) {

        this.personHealthEducationService.update(this.personHealthEducation).then((response) => {
          this.saved({ id: this.encounterHealthEducation.id });
        }, this.saveError);

      } else {
        console.log("this.personHealthEducation");
        console.log(this.personHealthEducation);
        console.log(this.encounterId);
        this.encounterHealthEducationService.saveEncounterHealthEducation(this.encounterId, this.personHealthEducation).then((response) => {
          this.saved({ id: response.id });
        }, this.saveError);

      }
    }

    saveError = () => {
      this.isSaving = false;
      this.dialog.error("Save Error", "HealthEducation could not be save at this time. Please try again");
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-health-education/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        healthEducationTopicId: "<",
        encounterHealthEducationId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsEncounterHealthEducationDialog", new Component());

}
