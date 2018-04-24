namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPersonDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;
  }

  class Controller implements IPersonDialog {

    personId: string;

    person: data.IPerson;

    educationlevels: Array<data.IEducationLevel> = [];
    occupations: Array<data.IOccupation> = [];
    maritalstates: Array<data.IMaritalState> = [];

    datePickerOpenStatus = {};

    public saved: (personId: Object) => void;

    public closed: () => void;

    static $inject = ["PersonService", "EducationLevelService", "OccupationService", "MaritalStateService"];
    constructor(private personService: data.IPersonService,
      private educationlevelService: data.IEducationLevelService,
      private occupationService: data.IOccupationService,
      private maritalStateService: data.IMaritalStateService) {

    }

    $onInit = () => {
      console.log("personId", this.personId);
      this.occupationService.query().then((response) => {
        this.occupations = response;
      });

      this.educationlevelService.query().then((response) => {
        this.educationlevels = response;
      });

      this.maritalStateService.query().then((response) => {
        this.maritalstates = response;
      });

      if (this.personId) {
        this.personService.get(this.personId).then((response) => {
          this.person = response;
        });
      }

    }

    openCalendar = (date: string) => {
      this.datePickerOpenStatus[date] = true;
    }

    save = () => {
      if (this.personId) {
        this.onSave(this.personService.update(this.person));
      }
      else {
        this.onSave(this.personService.save(this.person));
      }
    }

    close = () => {
      console.log("closing ...");
      this.closed();
    }

    onSave = (promise: ng.IPromise<data.IPerson>) => {
      promise.then((response) => {
        this.saved({ personId: response.id });
      }, () => {

      });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/person/person-popup.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "saved": "&",
        "closed": "&",
        "personId": "<"
      };

    }
  }

  app.component("mrsPersonPopup", new Component());

}
