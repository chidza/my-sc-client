namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {

    personId: string;
    encounterId: string;
    prescriptionId: string;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService,
      private params: ng.ui.IStateParamsService) {
      this.personId = params["personId"];
      this.encounterId = params["encounterId"];
      this.prescriptionId = params["prescriptionId"];
    }


    close = () => {
      this.state.go("consultation.management.imnci.medicines.list");
    }

  }
  
  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/consultation/imnci/medicines/edit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsConsultationPatientImnciMedicineEditLayout", new Component());

}
