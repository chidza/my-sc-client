namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
    opdId: string;
    admissionId: string;
    reload:number;

    diagnoses: Array<data.IEncounterDiagnosisList> = [];

    static $inject = ["PersonDiagnosisService"];
    constructor(private personDiagnosisService: data.IPersonDiagnosisService) {

    }


    init = () => {

      if (this.opdId) {
        this.personDiagnosisService.getForOpd(this.opdId).then((response) => {
          this.diagnoses = response;

        });
      }

      if (this.admissionId) {
        this.personDiagnosisService.getForAdmission(this.admissionId).then((response) => {
          this.diagnoses = response;
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
      public templateUrl = "app/ui/widgets/overview/diagnosis/visit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        opdId: "<",
        admissionId: "<",
        reload: "<"
      };

    }
  }

  app.component("mrsPersonVisitDiagnosisList", new Component());

}