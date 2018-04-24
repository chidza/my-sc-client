namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    personId: string;
  }

  class Controller implements ng.IController {

    personId: string;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService,
      stateParams: IParams) {
      this.personId = stateParams.personId;
    }

    onAdd = (id: string) => {
      this.state.go("reception.management.medicalaid-add", { personId: this.personId });
    }
    onEdit = (id: string) => {
      this.state.go("reception.management.medicalaid-edit", { personId: this.personId, id: id });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/medical-aid/medical-list.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionFileManagementMedicalAid", new Component());

}
