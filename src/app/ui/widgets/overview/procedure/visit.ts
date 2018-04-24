namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
    opdId: string;
    admissionId: string;
    reload: number;

    procedures: Array<data.IEncounterProcedureList> = [];

    static $inject = ["PersonProcedureService"];
    constructor(private personProcedureService: data.IPersonProcedureService) {

    }


    init = () => {

      if (this.opdId) {
        this.personProcedureService.getForOpd(this.opdId).then((response) => {
          this.procedures = response;

        });
      }

      if (this.admissionId) {
        this.personProcedureService.getForAdmission(this.admissionId).then((response) => {
          this.procedures = response;
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
      public templateUrl = "app/ui/widgets/overview/procedure/visit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        opdId: "<",
        admissionId: "<",
         reload: "<"
      };

    }
  }

  app.component("mrsPersonVisitProcedureList", new Component());

}