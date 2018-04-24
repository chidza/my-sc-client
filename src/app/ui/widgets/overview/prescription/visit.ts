namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
    opdId: string;
    admissionId: string;
    reload: number;

    prescriptions: Array<data.IEncounterPrescriptionList> = [];

    static $inject = ["PrescriptionService"];
    constructor(private prescriptionService: data.IPrescriptionService) {

    }

    init = () => {

      if (this.opdId) {
        this.prescriptionService.getForOpd(this.opdId).then((response) => {
          this.prescriptions = response;

        });
      }

      if (this.admissionId) {
        this.prescriptionService.getForAdmission(this.admissionId).then((response) => {
          this.prescriptions = response;
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
      public templateUrl = "app/ui/widgets/overview/prescription/visit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        opdId: "<",
        admissionId: "<",
        reload: "<"
      };

    }
  }

  app.component("mrsPersonVisitPrescriptionList", new Component());

}