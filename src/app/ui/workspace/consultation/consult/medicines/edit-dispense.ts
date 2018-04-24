namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {

    personId: string;
    encounterId: string;
    encounterMedicationId: string;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService,
      private params: ng.ui.IStateParamsService) {
      this.personId = params["personId"];
      this.encounterId = params["encounterId"];
      this.encounterMedicationId = params["encounterMedicationId"];
    }


    close = () => {
      this.state.go("consultation.management.consult.medicines.list-dispense");
    }

  }
  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/consultation/consult/medicines/edit-dispense.html",
      public controllerAs = "vm",
      public controller = Controller) {

    }
  }

  app.component("mrsConsultationPatientConsultMedicineDispenseEditLayout", new Component());

}
