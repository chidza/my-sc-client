namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
    opdId: string;
    admissionId: string;

    complaints: Array<data.IEncounterComplaintList> = [];

    static $inject = ["PersonComplaintService"];
    constructor(private personComplaintService: data.IPersonComplaintService) {

    }


    init = () => {

      if (this.opdId) {
        this.personComplaintService.getForOpd(this.opdId).then((response) => {
          this.complaints = response;
           console.log("honaiiii....",response);

        });
      }

      if (this.admissionId) {
        this.personComplaintService.getForAdmission(this.admissionId).then((response) => {
          this.complaints = response;
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
      public templateUrl = "app/ui/widgets/overview/complaint/encounter.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        opdId: "<",
        admissionId: "<"
      };

    }
  }

  app.component("mrsPersonEncounterComplaintList", new Component());

}
