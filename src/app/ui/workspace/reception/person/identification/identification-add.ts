namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    personId: string;
    memberId: string;
  }

  class Controller implements ng.IController {
    personId: string;
    memberId: string;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService, params: IParams) {
      this.personId = params.personId;
      this.memberId = params.memberId;
    }

    onClose = () => {
      this.state.go("reception.management.identification", { personId: this.personId });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/identification/identification-add.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionFileManagementIdentificationAdd", new Component());

}
