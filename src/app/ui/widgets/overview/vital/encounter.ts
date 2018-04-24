namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
    opdId: string;
    admissionId: string;

    vitals: Array<data.IEncounterVitalList> = [];

    static $inject = ["PersonVitalService"];
    constructor(private personVitalService: data.IPersonVitalService) {

    }
    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {

      if (this.opdId) {
        this.personVitalService.getForOpd(this.opdId).then((response) => {
          this.vitals = response;

        });
      }

      if (this.admissionId) {
        this.personVitalService.getForAdmission(this.admissionId).then((response) => {
          this.vitals = response;
        });
      }



    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/overview/vital/encounter.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        opdId: "<",
        admissionId: "<"
      };

    }
  }

  app.component("mrsPersonEncounterVitalList", new Component());

}