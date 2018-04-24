namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    id: string;
    personId: string;
  }

  class Controller implements ng.IController {
    id: string;
    personId: string;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService, params: IParams) {
      this.id = params.id;
      this.personId = params.personId;
      console.log(params);
    }

    onClose = () => {
      this.state.go("reception.management.identification", { personId: this.personId });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/identification/identification-edit.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionFileManagementIdentificationEdit", new Component());

}
