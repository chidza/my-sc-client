namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
    opdId: string;
    admissionId: string;
    reload: number;

    healthEducation: Array<data.IPersonHealthEducationList> = [];

    static $inject = ["PersonHealthEducationService"];
    constructor(private personHealthEducationService: data.IPersonHealthEducationService) {

    }
    init = () => {
      if (this.opdId) {
        this.personHealthEducationService.getForOpd(this.opdId).then((response) => {
          this.healthEducation = response;
        });
      }

      if (this.admissionId) {
        this.personHealthEducationService.getForAdmission(this.admissionId).then((response) => {
          this.healthEducation = response;
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
      public templateUrl = "app/ui/widgets/overview/health-education/visit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        opdId: "<",
        admissionId: "<",
        reload: "<"
      };

    }
  }

  app.component("mrsPersonVisitHealthEducationList", new Component());

}
