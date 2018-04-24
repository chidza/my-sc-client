namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
    opdId: string;
    admissionId: string;
    reload: number;

    vitals: Array<data.IEncounterVitalList> = [];

    static $inject = ["PersonVitalService"];
    constructor(private personVitalService: data.IPersonVitalService) {

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

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/overview/vital/visit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        opdId: "<",
        admissionId: "<",
        reload: "<"
      };

    }
  }

  app.component("mrsPersonVisitVitalList", new Component());

}