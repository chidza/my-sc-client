namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    personId: string;
  }

  class Controller implements ng.IController {

    personId: string;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService, stateParams: IParams) {
      this.personId = stateParams.personId;
    }

    close = (personId: string) => {
      this.state.go("reception.management.anc");
    }

    save = () => {
      this.state.go("reception.management.anc-edit", { personId: this.personId });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/consultation/anc/registration/enrollment/anc.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionFileManagementAncEdit", new Component());

}
